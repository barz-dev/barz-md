let fs = require('fs')
let path = require('path')
let { exec } = require('child_process')

let handler = async (m, { sock }) => {
  let q = m.quoted
  if (!q) return m.reply('Reply stikernya bang')

  m.reply('⏳ Converting...')

  try {
    // Download buffer langsung, ini paling aman di semua versi baileys
    let buffer = await sock.downloadMediaMessage(q, 'buffer')
    if (!buffer) return m.reply('Gagal download stiker')

    // Cek animasi: kalo ada isAnimated = true berarti stiker gerak
    let isAnimated = q.message?.stickerMessage?.isAnimated === true

    if (!isAnimated) {
      // Stiker statis → kirim jadi image
      await sock.sendMessage(m.chat, { 
        image: buffer, 
        caption: 'Jadi gambar ✅' 
      }, { quoted: m })
    } else {
      // Stiker animasi → convert ke mp4
      let tmp = path.join(process.cwd(), 'tmp')
      if (!fs.existsSync(tmp)) fs.mkdirSync(tmp, { recursive: true })
      
      let fileName = Date.now()
      let input = path.join(tmp, `${fileName}.webp`)
      let output = path.join(tmp, `${fileName}.mp4`)
      
      fs.writeFileSync(input, buffer)
      
      exec(`ffmpeg -y -i "${input}" -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" "${output}"`, async (err) => {
        try {
          if (err) {
            fs.unlinkSync(input)
            return m.reply('Gagal convert. Install ffmpeg dulu: apt install ffmpeg')
          }
          
          let vidBuffer = fs.readFileSync(output)
          await sock.sendMessage(m.chat, { 
            video: vidBuffer, 
            caption: 'Jadi video ✅',
            gifPlayback: false 
          }, { quoted: m })
          
          fs.unlinkSync(input)
          fs.unlinkSync(output)
        } catch (e) {
          console.log('[TOIMG FFMPEG ERROR]', e)
          m.reply('Error pas kirim video')
        }
      })
    }
  } catch (e) {
    console.log('[TOIMG ERROR]', e)
    m.reply('Error: ' + (e?.message || e))
  }
}

handler.help = ['toimg']
handler.tags = ['tools']
handler.command = ['toimg', 'tophoto']
module.exports = handler

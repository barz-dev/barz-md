let fs = require('fs')
let path = require('path')
let { exec } = require('child_process')

let handler = async (m, { sock }) => {
  let q = m.quoted
  if (!q) return m.reply('Reply stikernya bang')
  
  let sticker = q.message?.stickerMessage || q.message?.imageMessage
  if (!sticker) return m.reply('Yang di-reply harus stiker bang')

  m.reply('⏳ Converting...')

  // Download buffer langsung, gak pake stream ribet
  let buffer = await sock.downloadMediaMessage(q, 'buffer')
  if (!buffer) return m.reply('Gagal download stiker')

  let isAnimated = sticker.isAnimated || false
  
  if (!isAnimated) {
    // Stiker webp statis → kirim langsung sebagai image
    await sock.sendMessage(m.chat, { 
      image: buffer, 
      caption: 'Jadi gambar ✅' 
    }, { quoted: m })
  } else {
    // Stiker animasi webp → MP4 pake ffmpeg
    let tmp = path.join(process.cwd(), 'tmp')
    if (!fs.existsSync(tmp)) fs.mkdirSync(tmp)
    
    let input = path.join(tmp, `${Date.now()}.webp`)
    let output = path.join(tmp, `${Date.now()}.mp4`)
    
    fs.writeFileSync(input, buffer)

    exec(`ffmpeg -y -i "${input}" -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" "${output}"`, async (err) => {
      try {
        if (err) {
          console.log(err)
          fs.unlinkSync(input)
          return m.reply('Gagal convert. Install ffmpeg dulu bang: apt install ffmpeg')
        }
        
        let vidBuffer = fs.readFileSync(output)
        await sock.sendMessage(m.chat, { 
          video: vidBuffer, 
          caption: 'Jadi video ✅',
          gifPlayback: false // biar gak jadi gif
        }, { quoted: m })
        
        fs.unlinkSync(input)
        fs.unlinkSync(output)
      } catch (e) {
        console.log(e)
        m.reply('Error pas kirim video')
      }
    })
  }
}

handler.help = ['toimg']
handler.tags = ['tools']
handler.command = /^toimg$/i
module.exports = handler

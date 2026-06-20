let fs = require('fs')
let path = require('path')
let { exec } = require('child_process')
let { downloadMediaMessage } = require('@barz-dev/baileys') // import langsung

let handler = async (m, { sock }) => {
  let q = m.quoted
  if (!q) return m.reply('Reply stikernya bang')

  m.reply('⏳ Converting...')

  try {
    // Pake downloadMediaMessage dari baileys + reuploadRequest
    let buffer = await downloadMediaMessage(q, 'buffer', {}, {
      logger: console,
      reuploadRequest: sock.updateMediaMessage // ini kuncinya biar gak bad decrypt
    })
    
    if (!buffer) return m.reply('Gagal download stiker. Coba scan QR ulang')

    let isAnimated = q.message?.stickerMessage?.isAnimated === true

    if (!isAnimated) {
      await sock.sendMessage(m.chat, { image: buffer, caption: 'Jadi gambar ✅' }, { quoted: m })
    } else {
      let tmp = path.join(process.cwd(), 'tmp')
      if (!fs.existsSync(tmp)) fs.mkdirSync(tmp, { recursive: true })
      
      let fileName = Date.now()
      let input = path.join(tmp, `${fileName}.webp`)
      let output = path.join(tmp, `${fileName}.mp4`)
      
      fs.writeFileSync(input, buffer)
      
      exec(`ffmpeg -y -i "${input}" -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" "${output}"`, async (err) => {
        if (err) {
          fs.unlinkSync(input)
          return m.reply('Gagal convert ffmpeg: ' + err.message)
        }
        let vidBuffer = fs.readFileSync(output)
        await sock.sendMessage(m.chat, { video: vidBuffer, caption: 'Jadi video ✅' }, { quoted: m })
        fs.unlinkSync(input)
        fs.unlinkSync(output)
      })
    }
  } catch (e) {
    console.log('[TOIMG ERROR]', e)
    if (e.message?.includes('bad decrypt')) {
      return m.reply('Error decrypt bang ☢️\nSolusi: Hapus session/creds.json terus scan QR ulang. Media key WA lu udah expired.')
    }
    m.reply('Error: ' + (e?.message || e))
  }
}

handler.help = ['toimg']
handler.tags = ['tools']
handler.command = ['toimg']
module.exports = handler

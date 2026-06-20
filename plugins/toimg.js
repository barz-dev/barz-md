let fs = require('fs')
let path = require('path')
let { exec } = require('child_process')

let handler = async (m, { sock }) => {
  let q = m.quoted
  if (!q) return m.reply('Reply stikernya bang')

  // Debug: liat isi message nya apa
  console.log('[TOIMG DEBUG] Message keys:', Object.keys(q.message || {}))
  console.log('[TOIMG DEBUG] Full quoted:', JSON.stringify(q.message).slice(0, 200))

  m.reply('⏳ Converting...')

  try {
    // Ini kuncinya: downloadMediaMessage gak peduli dia stiker/image/document
    let buffer = await sock.downloadMediaMessage(q, 'buffer')
    if (!buffer || !Buffer.isBuffer(buffer)) throw 'Gagal download buffer'

    // Cek animasi dari mimetype, bukan dari isAnimated
    let mimetype = q.mimetype || q.msg?.mimetype || q.message?.stickerMessage?.mimetype || ''
    let isAnimated = mimetype.includes('webp') && q.message?.stickerMessage?.isAnimated

    if (!isAnimated) {
      await sock.sendMessage(m.chat, { image: buffer, caption: 'Jadi gambar ✅' }, { quoted: m })
    } else {
      let tmp = path.join(process.cwd(), 'tmp')
      if (!fs.existsSync(tmp)) fs.mkdirSync(tmp)
      
      let input = path.join(tmp, `${Date.now()}.webp`)
      let output = path.join(tmp, `${Date.now()}.mp4`)
      
      fs.writeFileSync(input, buffer)
      exec(`ffmpeg -y -i "${input}" -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" "${output}"`, async (err) => {
        if (err) {
          fs.unlinkSync(input)
          return m.reply('Gagal convert. ffmpeg error: ' + err.message)
        }
        let vidBuffer = fs.readFileSync(output)
        await sock.sendMessage(m.chat, { video: vidBuffer, caption: 'Jadi video ✅' }, { quoted: m })
        fs.unlinkSync(input)
        fs.unlinkSync(output)
      })
    }
  } catch (e) {
    console.log('[TOIMG ERROR]', e)
    m.reply('Error: ' + (e.message || e))
  }
}

handler.help = ['toimg']
handler.tags = ['tools']
handler.command = ['toimg']
module.exports = handler

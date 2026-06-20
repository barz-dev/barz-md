let handler = async (m, { sock }) => {
  let q = m.quoted
  if (!q) return m.reply('Reply stikernya bang')

  // Ambil pesan yang di-quote, bisa langsung atau nested
  let quotedMsg = q.message?.stickerMessage 
               || q.message?.extendedTextMessage?.contextInfo?.quotedMessage?.stickerMessage
               || q.message?.imageMessage // kadang stiker kebaca imageMessage

  if (!quotedMsg) {
    console.log('[TOIMG DEBUG] Quoted msg:', Object.keys(q.message || {})) // buat debug
    return m.reply('Yang di-reply bukan stiker bang. Stiker nya kebaca: ' + Object.keys(q.message || {}).join(', '))
  }

  m.reply('⏳ Converting...')
  
  try {
    let buffer = await sock.downloadMediaMessage(q, 'buffer')
    if (!buffer) throw 'Buffer kosong'
    
    let isAnimated = quotedMsg.isAnimated || false
    
    if (!isAnimated) {
      await sock.sendMessage(m.chat, { image: buffer, caption: 'Jadi gambar ✅' }, { quoted: m })
    } else {
      let fs = require('fs')
      let path = require('path')
      let { exec } = require('child_process')
      
      let tmp = path.join(process.cwd(), 'tmp')
      if (!fs.existsSync(tmp)) fs.mkdirSync(tmp)
      
      let input = path.join(tmp, `${Date.now()}.webp`)
      let output = path.join(tmp, `${Date.now()}.mp4`)
      
      fs.writeFileSync(input, buffer)
      exec(`ffmpeg -y -i "${input}" -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" "${output}"`, async (err) => {
        if (err) {
          fs.unlinkSync(input)
          return m.reply('Gagal convert. Install ffmpeg dulu bang')
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
handler.command = ['toimg', 'tophoto']
handler.owner = false
module.exports = handler

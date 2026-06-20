let fs = require('fs')
let path = require('path')
let { exec } = require('child_process')

let handler = async (m, { sock }) => {
  if (!m.quoted) return m.reply('Reply stikernya bang')

  m.reply('⏳ Converting...')

  try {
    // Ambil message yang bener buat di-download
    let msg = m.quoted.message || m.quoted
    let type = Object.keys(msg)[0] // stickerMessage / imageMessage / documentMessage

    if (!['stickerMessage', 'imageMessage', 'documentMessage'].includes(type)) {
      return m.reply('Yang di-reply bukan stiker bang. Kebacanya: ' + type)
    }

    // Download pake msg yang udah bener + kasih type nya
    let buffer = await sock.downloadMediaMessage(
      { message: msg, key: m.quoted.key },
      'buffer',
      {},
      { reuploadRequest: sock.updateMediaMessage }
    )

    if (!buffer) throw 'Buffer kosong'

    let isAnimated = msg.stickerMessage?.isAnimated === true

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
    if (e.message?.includes('No message present')) {
      return m.reply('Error: No message present\nSolusi: Stiker nya udah kehapus dari server WA. Coba kirim stiker baru terus reply lagi.')
    }
    m.reply('Error: ' + (e?.message || e))
  }
}

handler.help = ['toimg']
handler.tags = ['tools']
handler.command = ['toimg']
module.exports = handler

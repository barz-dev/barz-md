let fs = require('fs')
let path = require('path')
let { exec } = require('child_process')

let handler = async (m, { sock }) => {
  if (!m.quoted) return m.reply('Reply stikernya bang')

  m.reply('⏳ Converting...')

  try {
    // Jurus pamungkas: download langsung dari m.quoted, gak peduli tipe
    let buffer = await sock.downloadMediaMessage(m.quoted, 'buffer', {}, {
      reuploadRequest: sock.updateMediaMessage
    })

    if (!buffer || buffer.length < 100) throw 'Buffer kosong/gagal download'

    // Cek animasi dari context, kalo gak ada anggap statis
    let isAnimated = m.quoted.message?.stickerMessage?.isAnimated === true

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
          return m.reply('Gagal convert ffmpeg. Install dulu: pkg install ffmpeg')
        }
        let vidBuffer = fs.readFileSync(output)
        await sock.sendMessage(m.chat, { video: vidBuffer, caption: 'Jadi video ✅' }, { quoted: m })
        fs.unlinkSync(input)
        fs.unlinkSync(output)
      })
    }
  } catch (e) {
    console.log('[TOIMG ERROR]', e)
    m.reply('Error download stiker: ' + (e?.message || e) + '\n\nTips: Kirim stiker baru langsung ke bot, jangan forward dari chat lain')
  }
}

handler.help = ['toimg']
handler.tags = ['tools']
handler.command = ['toimg']
module.exports = handler

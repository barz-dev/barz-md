let fs = require('fs')
let path = require('path')
let { exec } = require('child_process')
let { downloadContentFromMessage } = require('@barz-dev/baileys')

let handler = async (m, { sock }) => {
  if (!m.quoted) return m.reply('Reply medianya bang. Stiker/gambar/video bebas')

  m.reply('⏳ Converting...')

  try {
    let msg = m.quoted.message
    let type = Object.keys(msg)[0] // ambil key pertama, gak peduli apa

    // Download pake stream, ini kunci biar semua tipe kebaca
    let mediaType = type.replace('Message', '')
    let stream = await downloadContentFromMessage(msg[type], mediaType, {
      reuploadRequest: sock.updateMediaMessage
    })

    let buffer = Buffer.from([])
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk])
    }

    if (!buffer.length || buffer.length < 100) throw 'Gagal download buffer'

    // Deteksi animasi: cek isAnimated atau mimetype
    let mimetype = msg[type]?.mimetype || ''
    let isAnimated = msg.stickerMessage?.isAnimated === true || mimetype.includes('video')

    if (!isAnimated && type === 'stickerMessage') {
      // Stiker statis → kirim image
      await sock.sendMessage(m.chat, { image: buffer, caption: 'Jadi gambar ✅' }, { quoted: m })
    }
    else if (type === 'imageMessage') {
      // Gambar biasa → kirim balik biar ke-compress ulang
      await sock.sendMessage(m.chat, { image: buffer, caption: 'Gambar ✅' }, { quoted: m })
    }
    else {
      // Stiker animasi / video / document → convert ke mp4
      let tmp = path.join(process.cwd(), 'tmp')
      if (!fs.existsSync(tmp)) fs.mkdirSync(tmp, { recursive: true })

      let fileName = Date.now()
      let input = path.join(tmp, `${fileName}.webp`)
      let output = path.join(tmp, `${fileName}.mp4`)

      fs.writeFileSync(input, buffer)

      exec(`ffmpeg -y -i "${input}" -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2,fps=15" -b:v 500k "${output}"`, async (err) => {
        if (err) {
          fs.unlinkSync(input)
          return m.reply('Gagal convert. Install ffmpeg: pkg install ffmpeg')
        }
        await sock.sendMessage(m.chat, {
          video: fs.readFileSync(output),
          caption: 'Jadi video ✅'
        }, { quoted: m })
        fs.unlinkSync(input)
        fs.unlinkSync(output)
      })
    }
  } catch (e) {
    console.log('[TOIMG ALL ERROR]', e)
    if (e.message?.includes('bad decrypt')) {
      return m.reply('☢️ Bad decrypt bang\nFix 1 detik:\n1. Stop bot\n2. Hapus folder session/\n3. Scan QR ulang\n4. Kirim media BARU →.toimg')
    }
    m.reply('Error: ' + (e?.message || e))
  }
}

handler.help = ['toimg']
handler.tags = ['tools']
handler.command = ['toimg', 'tophoto', 'toimage']
module.exports = handler

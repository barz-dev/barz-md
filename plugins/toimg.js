let { downloadContentFromMessage } = require('@barz-dev/baileys')
let { exec } = require('child_process')
let fs = require('fs')

let handler = async (m, { sock }) => {
  let q = m.quoted
  if (!q || !q.message?.stickerMessage) return m.reply('Reply stikernya bang')

  m.reply('⏳ Converting...')

  let stream = await downloadContentFromMessage(q.message.stickerMessage, 'sticker')
  let buffer = Buffer.from([])
  for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk])

  let isAnimated = q.message.stickerMessage.isAnimated || false
  
  if (!isAnimated) {
    // Stiker biasa webp → PNG/JPG
    await sock.sendMessage(m.chat, { image: buffer, caption: 'Jadi gambar ✅' }, { quoted: m })
  } else {
    // Stiker gerak webp → MP4 pake ffmpeg
    let input = `./tmp/${Date.now()}.webp`
    let output = `./tmp/${Date.now()}.mp4`
    
    if (!fs.existsSync('./tmp')) fs.mkdirSync('./tmp')
    fs.writeFileSync(input, buffer)

    exec(`ffmpeg -y -i ${input} -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" ${output}`, async (err) => {
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
}

handler.help = ['toimg']
handler.tags = ['tools']
handler.command = /^toimg$/i
module.exports = handler

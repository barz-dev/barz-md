let fetch = require('node-fetch')
let { generateWAMessageFromContent, proto, uploadFile } = require('@barz-dev/baileys')

let handler = async (m, { sock }) => {
  let endpoints = [
    'https://api.ikyyxd.my.id/random/cecan/china',
    'https://api.ikyyxd.my.id/random/cecan/indonesia',
    'https://api.ikyyxd.my.id/random/cecan/japan',
    'https://api.ikyyxd.my.id/random/cecan/korea'
  ]

  await m.react('⏱️')

  // 1. Download 10 gambar bareng
  let urls = Array.from({length: 10}, () => endpoints[Math.floor(Math.random() * endpoints.length)])
  let bufs = await Promise.allSettled(urls.map(u => fetch(u, {timeout: 20000}).then(r => r.buffer()).catch(() => null)))
  let images = bufs.map(r => r.value).filter(b => b && b.length > 1000)
  if (!images.length) return m.reply('☢️ My bini barz lagi tidur bang')

  // 2. Upload semua + bikin imageMessage
  let msgs = []
  for(let buf of images) {
    let { url } = await sock.uploadToServer(buf, { mediaType: 'image' }) // pake uploadToServer yg baru
    msgs.push({
      imageMessage: {
        url: url,
        mimetype: 'image/jpeg',
        fileSha256: '',
        fileLength: buf.length,
        height: 0,
        width: 0,
        mediaKey: '',
        fileEncSha256: '',
        directPath: '',
        mediaKeyTimestamp: Date.now()
      }
    })
  }

  // 3. Bikin album message yg bener
  let albumMsg = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
    albumMessage: {
      expectedImageCount: msgs.length,
      messages: msgs
    }
  }), { userJid: sock.user.id, quoted: m })

  // 4. Kirim 1x
  await sock.relayMessage(m.chat, albumMsg.message, { messageId: albumMsg.key.id })

  await sock.sendMessage(m.chat, { text: 'itu semua my bini barz loh 😏' }, { quoted: m })
  await m.react('✅')
}

handler.command = ['cecan']
module.exports = handler

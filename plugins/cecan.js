let fetch = require('node-fetch')
let { generateWAMessageFromContent, proto, getContentType } = require('@whiskeysockets/baileys')

let handler = async (m, { sock }) => {
  let endpoints = [
    'https://api.ikyyxd.my.id/random/cecan/china',
    'https://api.ikyyxd.my.id/random/cecan/indonesia',
    'https://api.ikyyxd.my.id/random/cecan/japan', 
    'https://api.ikyyxd.my.id/random/cecan/korea'
  ]

  await m.react('⏱️')

  // 1. Download 10 gambar bareng
  let urls = Array.from({length: 10}, () => endpoints[Math.random() * endpoints.length | 0])
  let bufs = await Promise.allSettled(urls.map(u => fetch(u, {timeout: 20000}).then(r => r.buffer()).catch(() => null)))
  let images = bufs.map(r => r.value).filter(b => b && b.length > 1000)
  if (!images.length) return m.reply('Zonk')

  // 2. Upload semua ke WA server dulu, kumpulin hasilnya
  let uploaded = await Promise.all(images.map(buf => sock.waUploadToServer(buf, 'image')))

  // 3. Bikin isi album: semua imageMessage langsung
  let albumContent = uploaded.map(img => ({
    imageMessage: img
  }))

  // 4. Bungkus jadi 1 albumMessage, kirim 1x doang
  let msg = generateWAMessageFromContent(m.chat, {
    albumMessage: proto.Message.AlbumMessage.fromObject({
      expectedImageCount: images.length,
      ...proto.Message.AlbumMessage.encode({
        messages: albumContent
      }).toJSON()
    })
  }, { quoted: m })

  await sock.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

  await sock.sendMessage(m.chat, { text: 'itu semua my bini barz loh 😏' }, { quoted: m })
  await m.react('✅')
}

handler.command = ['cecan']
module.exports = handler

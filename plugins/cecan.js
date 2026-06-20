let fetch = require('node-fetch')
let { generateWAMessageFromContent, proto } = require('@barz-dev/baileys')

let handler = async (m, { sock }) => {
  let msg = await sock.sendMessage(m.chat, { text: '🔍 Ngacak 10 cecan... Bikin album dulu' }, { quoted: m })
  
  let endpoints = [
    'https://api.ikyyxd.my.id/random/cecan/china',
    'https://api.ikyyxd.my.id/random/cecan/indonesia',
    'https://api.ikyyxd.my.id/random/cecan/japan',
    'https://api.ikyyxd.my.id/random/cecan/korea'
  ]

  let images = []
  
  for (let i = 0; i < 10; i++) {
    let url = endpoints[Math.floor(Math.random() * endpoints.length)]
    let negara = url.split('/').pop()

    try {
      let res = await fetch(url, { timeout: 20000, headers: { 'User-Agent': 'Mozilla/5.0' } })
      let buffer = await res.buffer()
      
      images.push({
        image: buffer,
        caption: `my bini barz\ndari: ${negara.toUpperCase()} ${i + 1}/10`
      })
      
      await new Promise(r => setTimeout(r, 700)) // jeda biar gak di limit
      
    } catch (e) {
      console.log(`Gagal ${negara}:`, e.message)
    }
  }

  if (images.length === 0) return m.reply('Zonk bang, API error semua')

  // Bikin album message
  let album = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
    albumMessage: {
      expectedImageCount: images.length,
      ...proto.Message.AlbumMessage.fromObject({
        messages: images.map((img, i) => {
          let message = proto.Message.fromObject({
            imageMessage: {
              mimetype: 'image/jpeg',
              caption: img.caption,
              jpegThumbnail: img.image.slice(0, 100) // thumbnail kecil
            }
          })
          return message
        })
      })
    }
  }), { quoted: m }) // <-- ini quoted ke pesan lu

  await sock.relayMessage(m.chat, album.message, { messageId: album.key.id })
}

handler.help = ['cecan']
handler.tags = ['random']
handler.command = ['cecan']
handler.limit = true

module.exports = handler

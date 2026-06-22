let fetch = require('node-fetch')
let { generateWAMessageFromContent, proto } = require('@whiskeysockets/baileys')

let handler = async (m, { sock }) => {
  let endpoints = [
    'https://api.ikyyxd.my.id/random/cecan/china',
    'https://api.ikyyxd.my.id/random/cecan/indonesia',
    'https://api.ikyyxd.my.id/random/cecan/japan',
    'https://api.ikyyxd.my.id/random/cecan/korea'
  ]

  await m.react('⏱️')

  // 1. Download semua bareng pake Promise.all
  let urls = Array.from({ length: 10 }, () => endpoints[Math.random() * endpoints.length | 0])

  let buffers = await Promise.allSettled(
    urls.map(u => fetch(u, {timeout: 20000}).then(r => r.buffer()).catch(() => null))
  )

  let images = buffers.map(r => r.value).filter(b => b && b.length > 1000)
  if (!images.length) return m.reply('Zonk semua')

  // 2. Bikin album message manual - INI KUNCINYA
  let album = await generateWAMessageFromContent(m.chat, {
    messageContextInfo: {},
    albumMessage: {
      expectedImageCount: images.length
    }
  }, { userJid: sock.user.id })

  // 3. Upload semua gambar + masukin ke album
  for (let i = 0; i < images.length; i++) {
    let imgMsg = await generateWAMessageFromContent(m.chat, {
      imageMessage: await sock.waUploadToServer(images[i], 'image')
    }, { userJid: sock.user.id })

    imgMsg.message.imageMessage.contextInfo = {
     ...album.message.albumMessage.contextInfo,
      remoteJid: m.chat,
      fromMe: true,
      stanzaId: album.key.id,
      participant: sock.user.id
    }

    await sock.relayMessage(m.chat, imgMsg.message, { messageId: imgMsg.key.id })
  }

  // 4. Kirim album induknya paling akhir
  await sock.relayMessage(m.chat, album.message, { messageId: album.key.id })

  await sock.sendMessage(m.chat, { text: 'itu semua my bini barz loh 😏' }, { quoted: m })
  await m.react('✅')
}

handler.command = ['cecan']
module.exports = handler

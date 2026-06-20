let fetch = require('node-fetch')
let { generateWAMessageContent, generateWAMessageFromContent } = require('@whiskeysockets/baileys')

let handler = async (m, { conn }) => {
  await conn.sendMessage(m.chat, { text: '🔍 Ngacak 10 cecan... Bikin album' }, { quoted: m })
  
  let endpoints = [
    'https://api.ikyyxd.my.id/random/cecan/china',
    'https://api.ikyyxd.my.id/random/cecan/indonesia',
    'https://api.ikyyxd.my.id/random/cecan/japan',
    'https://api.ikyyxd.my.id/random/cecan/korea'
  ]

  let mediaArray = []
  
  for (let i = 0; i < 10; i++) {
    let url = endpoints[Math.floor(Math.random() * endpoints.length)]
    let negara = url.split('/').pop()

    try {
      let res = await fetch(url, { 
        timeout: 20000,
        headers: { 'User-Agent': 'Mozilla/5.0' }
      })
      let buffer = await res.buffer()
      
      // Upload beneran ke server WA biar ada key + thumbnail
      let mediaMsg = await generateWAMessageContent({ 
        image: buffer 
      }, { upload: conn.waUploadToServer })
      
      mediaArray.push({
        imageMessage: {
          ...mediaMsg.imageMessage,
          caption: `my bini barz\ndari ${negara.toUpperCase()} ${i + 1}/10`
        }
      })
      
      await new Promise(r => setTimeout(r, 800))
      
    } catch (e) {
      console.log(`Gagal ${negara}:`, e.message)
    }
  }

  if (mediaArray.length === 0) return conn.sendMessage(m.chat, { text: 'Zonk bang, API error' }, { quoted: m })

  // Bikin album message yg bener
  let albumMsg = generateWAMessageFromContent(m.chat, {
    albumMessage: {
      expectedImageCount: mediaArray.length,
      messages: mediaArray
    }
  }, { quoted: m })

  await conn.relayMessage(m.chat, albumMsg.message, { messageId: albumMsg.key.id })
  await conn.sendMessage(m.chat, { text: `Selesai! ${mediaArray.length}/10 slide ✅` }, { quoted: m })
}

handler.command = ['cecan']
handler.limit = true
module.exports = handler

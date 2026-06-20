let fetch = require('node-fetch')
let { generateWAMessageContent, generateWAMessageFromContent } = require('@barz-dev/baileys')

let handler = async (m, { sock, args, text, q, command, cmd, prefix }) => {
  // Validasi sock biar gak undefined
  if (!sock || !sock.waUploadToServer) {
    return m.reply('❌ Error: sock undefined. Cek handler lu bang')
  }

  try {
    await sock.sendMessage(m.chat, { text: '🔍 Ngacak 10 bini barz... Bikin album' }, { quoted: m })
    
    let endpoints = [
      'https://api.ikyyxd.my.id/random/cecan/china',
      'https://api.ikyyxd.my.id/random/cecan/indonesia',
      'https://api.ikyyxd.my.id/random/cecan/japan',
      'https://api.ikyyxd.my.id/random/cecan/korea'
    ]

    let mediaArray = []
    
    for (let i = 0; i < 10; i++) {
      let url = endpoints[Math.floor(Math.random() * endpoints.length)]
      let negara = url.split('/').pop().toUpperCase()

      try {
        let res = await fetch(url, { 
          timeout: 20000,
          headers: { 'User-Agent': 'Mozilla/5.0' }
        })
        
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        
        let buffer = await res.buffer()
        if (!buffer || buffer.length < 1000) throw new Error('Buffer kosong')
        
        // Upload ke server WA
        let mediaMsg = await generateWAMessageContent({ 
          image: buffer 
        }, { upload: sock.waUploadToServer })
        
        mediaArray.push({
          imageMessage: {
            ...mediaMsg.imageMessage,
            caption: `my bini barz\ndari: ${negara}`
          }
        })
        
        await new Promise(r => setTimeout(r, 800))
        
      } catch (e) {
        console.log(`[Cecan] Gagal ${negara}:`, e.message)
        continue // skip kalo error, lanjut yg lain
      }
    }

    if (mediaArray.length === 0) {
      return sock.sendMessage(m.chat, { text: '☢️ Zonk bang, semua API error. Coba lagi nanti' }, { quoted: m })
    }

    // Bikin album message
    let albumMsg = generateWAMessageFromContent(m.chat, {
      albumMessage: {
        expectedImageCount: mediaArray.length,
        messages: mediaArray
      }
    }, { quoted: m })

    await sock.relayMessage(m.chat, albumMsg.message, { messageId: albumMsg.key.id })
    
  } catch (e) {
    console.error('[Cecan Plugin Error]', e)
    await m.react('❌')
    return m.reply(`☢️ *Error!*\n\nCommand \`${cmd}\` crash: ${e.message}`)
  }
}

handler.command = ['cecan']
handler.limit = true
handler.help = ['cecan']
handler.tags = ['random']

module.exports = handler

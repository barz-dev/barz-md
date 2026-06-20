let fetch = require('node-fetch')

let handler = async (m, { sock, cmd }) => {
  if (!sock || !sock.sendAlbum) {
    return m.reply('❌ Error: sock.sendAlbum gak ada')
  }

  let endpoints = [
    'https://api.ikyyxd.my.id/random/cecan/china',
    'https://api.ikyyxd.my.id/random/cecan/indonesia',
    'https://api.ikyyxd.my.id/random/cecan/japan',
    'https://api.ikyyxd.my.id/random/cecan/korea'
  ]

  let albumData = []
  await m.react('⏱️')
  
  for (let i = 0; i < 10; i++) {
    let url = endpoints[Math.floor(Math.random() * endpoints.length)]

    try {
      let res = await fetch(url, { 
        timeout: 20000,
        headers: { 'User-Agent': 'Mozilla/5.0' }
      })
      
      let buffer = await res.buffer()
      if (!buffer || buffer.length < 1000) continue
      
      albumData.push({
        image: buffer
        // GAK PAKE CAPTION SAMA SEKALI BIAR NYATU
      })
      
      await new Promise(r => setTimeout(r, 400))
      
    } catch (e) {
      console.log(`[Cecan] Skip:`, e.message)
    }
  }

  if (albumData.length === 0) {
    await m.react('❌')
    return m.reply('☢️ Zonk bang, semua API error')
  }

  // Kirim album tanpa caption = langsung nyatu 1 bubble
  await sock.sendAlbum(m.chat, { albumMessage: albumData }, m)
  
  // Closing text setelah album
  await sock.sendMessage(m.chat, { 
    text: 'itu semua my bini barz loh 😏🤭🤫' 
  }, { quoted: m })
  
  await m.react('✅')
}

handler.command = ['cecan']
handler.limit = true
module.exports = handler

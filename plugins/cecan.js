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

  await m.react('⏱️')
  
  // 1. Generate 10 URL random
  let urls = Array.from({ length: 10 }, () => 
    endpoints[Math.floor(Math.random() * endpoints.length)]
  )

  // 2. Download semua bareng2, kumpulin dulu di RAM
  let results = await Promise.allSettled(
    urls.map(url => 
      fetch(url, { timeout: 20000, headers: { 'User-Agent': 'Mozilla/5.0' } })
        .then(res => res.buffer())
        .catch(() => null)
    )
  )

  // 3. Filter yg berhasil + buffer > 1KB
  let albumData = results
    .map(r => r.value)
    .filter(buf => buf && buf.length > 1000)
    .map(buf => ({ image: buf })) // GAK PAKE CAPTION = NYATU

  if (albumData.length === 0) {
    await m.react('❌')
    return m.reply('☢️ Zonk bang, semua API error')
  }

  // 4. Kirim sekali = langsung nyatu 1 bubble, gak ada jeda
  await sock.sendAlbum(m.chat, { albumMessage: albumData }, m)
  
  await sock.sendMessage(m.chat, { 
    text: 'itu semua my bini barz loh 😏🤭🤫' 
  }, { quoted: m })
  
  await m.react('✅')
}

handler.command = ['cecan']
handler.limit = true
module.exports = handler

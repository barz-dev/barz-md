let fetch = require('node-fetch')

let handler = async (m, { sock }) => {
  let endpoints = [
    'https://api.ikyyxd.my.id/random/cecan/china',
    'https://api.ikyyxd.my.id/random/cecan/indonesia',
    'https://api.ikyyxd.my.id/random/cecan/japan',
    'https://api.ikyyxd.my.id/random/cecan/korea'
  ]

  await m.react('⏱️')

  // 1. Download 10 gambar bareng2
  let urls = Array.from({length: 10}, () => endpoints[Math.floor(Math.random() * endpoints.length)])
  let bufs = await Promise.allSettled(urls.map(u => fetch(u, {timeout: 20000}).then(r => r.buffer()).catch(() => null)))
  let images = bufs.map(r => r.value).filter(b => b && b.length > 1000)
  
  if (!images.length) return m.reply('☢️ Zonk bang')

  // 2. @barz-dev/baileys support kirim buffer langsung + auto nyatu
  await sock.sendAlbum(m.chat, images.map(buf => ({ image: buf })), m)

  // 3. Closing text
  await sock.sendMessage(m.chat, { text: 'itu semua my bini barz loh 😏' }, { quoted: m })
  await m.react('✅')
}

handler.command = ['cecan']
handler.limit = true
module.exports = handler

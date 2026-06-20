let fetch = require('node-fetch')

let handler = async (m, { sock }) => {
  m.reply('🔍 Ngacak 10 cecan...')

  let endpoints = [
    'https://api.ikyyxd.my.id/random/cecan/china',
    'https://api.ikyyxd.my.id/random/cecan/indonesia',
    'https://api.ikyyxd.my.id/random/cecan/japan',
    'https://api.ikyyxd.my.id/random/cecan/korea'
  ]

  for (let i = 0; i < 10; i++) {
    let url = endpoints[Math.floor(Math.random() * endpoints.length)]
    let negara = url.split('/').pop()

    try {
      let res = await fetch(url, { 
        timeout: 20000,
        headers: { 'User-Agent': 'Mozilla/5.0' }
      })
      
      let buffer = await res.buffer() // ambil langsung buffer, gak pake json
      let negaraText = negara.toUpperCase()

      await sock.sendMessage(m.chat, {
        image: buffer, // kirim buffer langsung
        mimetype: 'image/jpeg', // paksa jadi jpeg biar kebuka di WA
        caption: `CECAN ${negaraText} ${i + 1}/10\nbarz pen nyoli`
      }, { quoted: m })
      
      await new Promise(r => setTimeout(r, 1000)) // jeda 0.8 detik
      
    } catch (e) {
      console.log(`Gagal ${negara}:`, e.message)
      await new Promise(r => setTimeout(r, 1500))
    }
  }

  m.reply('Selesaiya bang ✅')
}

handler.command = ['cecan']
handler.limit = true
module.exports = handler

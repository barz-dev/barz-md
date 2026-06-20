let fetch = require('node-fetch')

let handler = async (m, { sock }) => {
  m.reply('🔍 Ngacak 10 cecan dari 4 negara... Tunggu bentar')

  let endpoints = [
    'https://api.ikyyxd.my.id/random/cecan/china',
    'https://api.ikyyxd.my.id/random/cecan/indonesia', 
    'https://api.ikyyxd.my.id/random/cecan/japan',
    'https://api.ikyyxd.my.id/random/cecan/korea'
  ]

  try {
    // Ambil 10 gambar acak dari 4 endpoint
    let promises = Array.from({ length: 10 }, async (_, i) => {
      let url = endpoints[Math.floor(Math.random() * endpoints.length)]
      let res = await fetch(url)
      let json = await res.json()
      let imgUrl = json.url || json.result?.url || json.image || json.data?.url
      let negara = url.split('/').pop() // ambil nama negara dari url
      return { imgUrl, negara }
    })

    let results = await Promise.all(promises)
    results = results.filter(v => v.imgUrl)

    if (results.length === 0) throw 'Gagal dapet gambar'

    m.reply(`✅ Dapet ${results.length} foto acak. Ngirim slide...`)

    // Kirim 1 per 1 biar aman
    for (let i = 0; i < results.length; i++) {
      await sock.sendMessage(m.chat, {
        image: { url: results[i].imgUrl },
        caption: `CECAN ${results[i].negara.toUpperCase()} ${i + 1}/10\nbarz ange pen nyoli`
      }, { quoted: m })
      
      await new Promise(r => setTimeout(r, 500)) // delay 0.5 detik anti spam
    }

  } catch (e) {
    console.log('[CECAN ERROR]', e)
    m.reply('Gagal bang 😭 API nya lagi down. Coba lagi 10 detik')
  }
}

handler.help = ['cecan']
handler.tags = ['random'] 
handler.command = ['cecan', 'cewe']
handler.limit = true

module.exports = handler

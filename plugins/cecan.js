let fetch = require('node-fetch')

let handler = async (m, { sock }) => {
  let endpoints = [
    'https://api.ikyyxd.my.id/random/cecan/china',
    'https://api.ikyyxd.my.id/random/cecan/indonesia',
    'https://api.ikyyxd.my.id/random/cecan/japan',
    'https://api.ikyyxd.my.id/random/cecan/korea'
  ]

  await m.react('⏱️')

  try {
    // 1. Download 10 gambar bareng
    let urls = Array.from({length: 10}, () => endpoints[Math.floor(Math.random() * endpoints.length)])
    
    let results = await Promise.allSettled(
      urls.map(u => fetch(u, {timeout: 20000}).then(r => r.buffer()))
    )

    // 2. Filter yg sukses + buffer valid. INI KUNCINYA BIAR GAK ERROR
    let images = results
      .filter(r => r.status === 'fulfilled' && r.value && r.value.length > 1000)
      .map(r => r.value)

    if (!images.length) {
      await m.react('❌')
      return m.reply('☢️ Zonk bang, semua API error/timeout')
    }

    // 3. @barz-dev/baileys: kirim buffer langsung, auto nyatu
    await sock.sendAlbum(m.chat, images.map(buf => ({ image: buf })), { quoted: m })

    await sock.sendMessage(m.chat, { text: 'itu semua my bini barz loh 😏' }, { quoted: m })
    await m.react('✅')

  } catch (e) {
    console.log('[Cecan Error]', e)
    await m.react('❌')
    m.reply('☢️ Error: ' + e.message)
  }
}

handler.command = ['cecan']
handler.limit = true
module.exports = handler

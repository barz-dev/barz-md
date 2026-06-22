let fetch = require('node-fetch')

let handler = async (m, { sock }) => {
  let endpoints = [
    'https://api.ikyyxd.my.id/random/cecan/china',
    'https://api.ikyyxd.my.id/random/cecan/indonesia',
    'https://api.ikyyxd.my.id/random/cecan/japan',
    'https://api.ikyyxd.my.id/random/cecan/korea'
  ]

  await m.react('⏱️')

  let images = []
  
  // Download 1-1 tapi tetep cepet. Kalo gagal skip aja
  for(let i = 0; i < 10; i++) {
    try {
      let url = endpoints[Math.floor(Math.random() * endpoints.length)]
      let res = await fetch(url, {timeout: 15000})
      let buf = await res.buffer()
      if(buf && buf.length > 1000) images.push(buf)
    } catch {
      continue // skip kalo error, lanjut gambar berikutnya
    }
  }

  if(!images.length) {
    await m.react('❌')
    return m.reply('☢️ Zonk bang, 10/10 API gagal')
  }

  try {
    // @barz-dev/baileys sendAlbum
    await sock.sendAlbum(m.chat, images.map(buf => ({ image: buf })), { quoted: m })
    
    await sock.sendMessage(m.chat, { text: `dapet ${images.length}/10 foto 😏` }, { quoted: m })
    await m.react('✅')
  } catch(e) {
    console.log(e)
    await m.react('❌')
    m.reply('☢️ Error sendAlbum: ' + e.message)
  }
}

handler.command = ['cecan']
handler.limit = true
module.exports = handler

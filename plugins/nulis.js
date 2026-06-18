const axios = require('axios')

let handler = async (m, { sock, text }) => {
  if (!text) return m.reply(`*Contoh:*\n.nulis barz ganteng🥰`)
  
  await m.reply('Nulis dulu...')
  let url = `https://api.ikyyxd.my.id/maker/nulis?text=${encodeURIComponent(text)}`
  
  try {
    await sock.sendImage(m.chat, url, m, { caption: 'Udah ditulis ✅' })
  } catch(e) {
    m.reply('API nya error bang: ' + e.message)
  }
}
handler.help = ['nulis <text>']
handler.tags = ['tools']
handler.command = ['nulis']
module.exports = handler
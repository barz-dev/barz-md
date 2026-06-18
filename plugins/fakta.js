const axios = require('axios')
let handler = async (m, { sock }) => {
  await m.reply('Cari fakta random...')
  try {
    let { data } = await axios.get('https://api.tekno.com/api/fakta-unik')
    m.reply(`*Fakta Unik* 🧠\n\n${data.result.fakta}`)
  } catch(e) {
    let backup = [
      "Gurita punya 3 jantung loh",
      "Ubur2 abadi, bisa balik jadi bayi terus", 
      "Leuwiliang artinya tempat lewat banyak orang"
    ]
    m.reply(`*Fakta Backup* 🧠\n\n${backup[Math.floor(Math.random()*backup.length)]}`)
  }
}
handler.help = ['fakta']
handler.tags = ['tools'] // <- udah ganti ke tools
handler.command = ['fakta']
module.exports = handler
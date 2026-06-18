const axios = require('axios')
let handler = async (m, { sock }) => {
  await m.reply('Nyari jokes receh...')
  try {
    let { data } = await axios.get('https://api.vhtear.my.id/api/random/darkjokes')
    m.reply(`*Dark Jokes* 💀\n\n${data.result}\n\nJangan baper ya`)
  } catch(e) {
    m.reply('Vhtear lagi turu bang 💤')
  }
}
handler.help = ['darkjokes', 'dj']
handler.tags = ['tools'] // <- udah ganti ke tools
handler.command = ['darkjokes', 'dj']
module.exports = handler
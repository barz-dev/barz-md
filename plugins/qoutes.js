const axios = require('axios')

let handler = async (m, { sock }) => {
  await m.reply('Ngambil quotes...')
  try {
    let { data } = await axios.get('https://zenquotes.io/api/random')
    let quote = data[0].q
    let author = data[0].a

    m.reply(`"${quote}"\n\n— ${author}`)
  } catch(e) {
    m.reply('API nya error bang, coba lagi')
  }
}
handler.help = ['quotes']
handler.tags = ['Fun']
handler.command = ['quotes', 'quote']
module.exports = handler
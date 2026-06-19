// plugins/getpp.js - CommonJS version
let handler = async (m, { conn, text }) => {
  let who = m.quoted?.sender ||
            m.mentionedJid[0] ||
            (text? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : m.sender)

  if (!who) return m.reply('Reply chat, tag, atau ketik nomornya dong')

  let pp = await conn.profilePictureUrl(who, 'image')
   .catch(_ => 'https://i.imgur.com/2dzxIWP.png')

  await conn.sendMessage(m.chat, {
    image: { url: pp },
    caption: `PP @${who.split('@')[0]}`,
    mentions: [who]
  }, { quoted: m })
}

handler.help = ['getpp @tag/nomor/reply']
handler.tags = ['tools']
handler.command = ['getpp', 'pp']

module.exports = handler

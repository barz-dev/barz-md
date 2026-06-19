// plugin getpp.js - Baileys
let handler = async (m, { conn, text }) => {
  let who = m.quoted?.sender ||
            m.mentionedJid[0] ||
            (text? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : m.sender)

  if (!who) return m.reply('Tag, reply, atau kirim nomornya dong')

  let pp = await conn.profilePictureUrl(who, 'image')
   .catch(_ => 'https://i.imgur.com/2dzxIWP.png')

  await conn.sendMessage(m.chat, {
    image: { url: pp },
    caption: `PP @${who.split('@')[0]}`,
    mentions: [who]
  }, { quoted: m })
}

handler.command = ['getpp', 'pp']
handler.help = ['getpp @tag/nomor/reply']
handler.tags = ['tools']
export default handler

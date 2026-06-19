let handler = async (m, { sock, text }) => {
  let who = m.quoted?.sender ||
            m.mentionedJid[0] ||
            (text? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : m.sender)

  if (!who) return m.reply(`Contoh:\n.getpp @tag\n.getpp 628xxx\nReply chat orang`)

  await m.reply(`Ngambil PP... bentar ⏳`)

  try {
    let ppUrl = await sock.profilePictureUrl(who, 'image').catch(() => null)

    if (!ppUrl) return m.reply(`PP-nya private atau belum diset 😢`)

    await sock.sendMessage(m.chat, {
      image: { url: ppUrl },
      caption: `PP @${who.split('@')[0]}`,
      mentions: [who]
    }, { quoted: m })

  } catch(e) {
    console.log(e)
    m.reply(`Gagal ambil PP bang 😭\nError: ${e.message}`)
  }
}

handler.help = ['getpp @tag/nomor/reply']
handler.tags = ['tools']
handler.command = ['getpp', 'pp']

module.exports = handler

let handler = async (m, { sock, text }) => {
  try {
    let who = m.quoted?.sender ||
              m.mentionedJid[0] ||
              (text? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : m.sender)

    if (!who) return m.reply('Reply/tag/nomor dong')

    await m.react('⏳')

    let ppUrl = await sock.profilePictureUrl(who, 'image').catch(() => null)

    if (!ppUrl) {
      await m.react('❌')
      return m.reply('PP-nya private atau belum diset')
    }

    await sock.sendMessage(m.chat, {
      image: { url: ppUrl },
      caption: `PP @${who.split('@')[0]}`,
      mentions: [who]
    }, { quoted: m })
    await m.react('✅')

  } catch (e) {
    await m.react('❌')
    m.reply('Error: ' + e.message)
    console.log(e)
  }
}

handler.command = ['getpp', 'pp']
handler.help = ['getpp']
handler.tags = ['tools']
module.exports = handler

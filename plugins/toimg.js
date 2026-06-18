let handler = async (m, { sock }) => {
  if (!m.quoted?.sticker) return m.reply('Reply stikernya bang')
  
  let mime = m.quoted.mimetype || ''
  let media = await m.quoted.download()
  
  if (/webp/.test(mime)) {
    // Stiker biasa → PNG
    await sock.sendMessage(m.chat, { image: media, caption: 'Jadi gambar ✅' }, { quoted: m })
  } else if (/video/.test(mime)) {
    // Stiker gerak → MP4
    await sock.sendMessage(m.chat, { video: media, caption: 'Jadi Video ✅' }, { quoted: m })
  } else {
    m.reply('Bukan stiker itu')
  }
}
handler.help = ['toimg']
handler.tags = ['tools']
handler.command = ['toimg']
module.exports = handler
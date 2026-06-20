let handler = async (m, { sock }) => {
  if (!m.quoted) return m.reply('Reply foto/video view once nya bang')

  let msg = m.quoted.message // INI KUNCINYA
  let type = Object.keys(msg)[0]

  // Handle V1, V2, V2Extension
  let viewOnce = msg.viewOnceMessage?.message ||
                 msg.viewOnceMessageV2?.message ||
                 msg.viewOnceMessageV2Extension?.message

  if (!viewOnce) return m.reply('❌ Itu bukan view once / udah kadaluarsa')

  let mediaType = Object.keys(viewOnce)[0]
  let media = viewOnce[mediaType]

  try {
    await m.react('⏱️')
    let buffer = await sock.downloadMediaMessage({ message: viewOnce }, 'buffer')
    if (!buffer) return m.reply('❌ Gagal download')

    let caption = media.caption || `View Once dari @${m.quoted.sender.split('@')[0]}`

    if (mediaType === 'imageMessage') {
      await sock.sendMessage(m.chat, { image: buffer, caption }, { quoted: m })
    } else if (mediaType === 'videoMessage') {
      await sock.sendMessage(m.chat, { video: buffer, caption }, { quoted: m })
    } else {
      await sock.sendMessage(m.chat, { document: buffer, fileName: 'viewonce.bin' }, { quoted: m })
    }

    await m.react('✅')
  } catch (e) {
    m.reply('❌ Error: ' + e.message)
    await m.react('❌')
  }
}

handler.command = ['rvo', 'readvo']
handler.tags = ['tools']
handler.help = ['rvo - reply viewonce']

module.exports = handler

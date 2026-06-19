let handler = async (m) => {
  let audioCium = 'https://files.catbox.moe/pq6khm.mp3'
  
  await sock.sendMessage(m.chat, {
    audio: { url: audioCium },
    mimetype: 'audio/mp4',
    ptt: true
  }, { quoted: m })
}

handler.help = ['cium']
handler.tags = ['fun']
handler.customPrefix = /^(cium)$/i

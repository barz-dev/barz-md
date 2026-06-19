let handler = async (m) => {
  let audioCium = 'https://files.catbox.moe/pq6khm.mp3'
  
  // React cium dulu
  await sock.sendMessage(m.chat, {
    react: {
      text: '💋',
      key: m.key
    }
  })
  
  // Delay dikit biar rapi
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Kirim audio nyium
  await sock.sendMessage(m.chat, {
    audio: { url: audioCium },
    mimetype: 'audio/mp4',
    ptt: true
  }, { quoted: m })
}

handler.help = ['cium']
handler.tags = ['fun']
handler.command = /^cium$/i
module.exports = handler

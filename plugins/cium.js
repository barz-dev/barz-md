let handler = async (m, { sock }) => {
  console.log('CIUM KE TRIGGER!')
  
  let audioCium = 'https://files.catbox.moe/pq6khm.mp3'
  
  try {
    // React cium dulu
    await sock.sendMessage(m.chat, {
      react: { text: '💋', key: m.key }
    })
    
    // Delay dikit
    await new Promise(r => setTimeout(r, 500))
    
    // Kirim audio nyium
    await sock.sendMessage(m.chat, {
      audio: { url: audioCium },
      mimetype: 'audio/mp4',
      ptt: true
    }, { quoted: m })
    
  } catch(e) {
    console.log('ERROR:', e)
    sock.sendMessage(m.chat, { text: 'Gagal bang: ' + e.message }, { quoted: m })
  }
}

handler.command = ['cium', 'kiss', 'kissme', 'ciumaku']
handler.help = ['cium']
handler.tags = ['fun']
module.exports = handler

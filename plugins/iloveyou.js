const { getContentType } = require("@barz-dev/baileys") // kalo gak ada pake yg ori

let handler = async (m, { sock, command }) => {
  let audioUrl = 'https://bucin-livid.vercel.app/audio/lopyou.mp3'
  let caption = command === 'love'? 'I love you too 🥰' : 'I love you ❤️'

  await m.react('🎵')
  
  try {
    await sock.sendMessage(m.chat, {
      audio: { url: audioUrl },
      mimetype: 'audio/mpeg',
      ptt: true, // biar jadi VN bulat
      fileName: 'loveyou.mp3'
    }, { quoted: m })
    
    await m.react('✅')
  } catch (e) {
    await m.react('❌')
    m.reply(`Gagal kirim VN: ${e.message}`)
  }
}

handler.command = ['iloveyou', 'love']
handler.help = ['iloveyou', 'love']
handler.tags = ['fun']

module.exports = handler

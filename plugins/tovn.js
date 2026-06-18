const { toAudio } = require('../lib/converter') // kalo lu pake lib converter

let handler = async (m, { sock }) => {
  if (!m.quoted || !/audio|video/.test(m.quoted.mimetype)) 
    return m.reply('Reply audio/video bang')
  
  m.reply('Convert ke VN...')
  let media = await m.quoted.download()
  let audio = await toAudio(media, 'mp4') // convert ke opus
  
  await sock.sendMessage(m.chat, { 
    audio: audio, 
    mimetype: 'audio/ogg; codecs=opus',
    ptt: true // biar jadi VN bulat
  }, { quoted: m })
}
handler.help = ['tovn']
handler.tags = ['tools'] 
handler.command = ['tovn']
module.exports = handler
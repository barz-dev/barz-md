const gTTS = require('gtts');
const fs = require('fs');
const path = require('path');

let handler = async (m, { sock, text, usedPrefix, command }) => {
  if (!text) throw `Contoh: ${usedPrefix + command} Halo dunia`;
  if (text.length > 500) throw `Teks kepanjangan, maksimal 500 karakter!`;

  const langList = ['id', 'en', 'ja', 'ko', 'es', 'fr', 'ar', 'ru'];
  const randomLang = langList[Math.floor(Math.random() * langList.length)];

  const tmpDir = path.join(__dirname, '../tmp');
  const fileName = path.join(tmpDir, `tts-${Date.now()}.mp3`);
  
  m.reply(`_Sedang membuat audio..._ [${randomLang}]`);

  try {
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

    const gtts = new gTTS(text, randomLang);
    await new Promise((resolve, reject) => {
      gtts.save(fileName, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // INI YANG DIBENERIN ↓↓
    await sock.sendMessage(m.chat, {
      audio: fs.readFileSync(fileName), // jangan {url: fileName}
      mimetype: 'audio/mp4', // ganti ke mp4 biar 100% jadi vn
      ptt: true
    }, { quoted: m });

    fs.unlinkSync(fileName); // hapus langsung aja, gak usah setTimeout

  } catch (e) {
    console.log('ERROR TTS:', e);
    m.reply('Gagal bikin audio bang: ' + e.message);
  }
};

handler.help = ['tts <teks>'];
handler.tags = ['tools'];
handler.command = ['tts','ngomong']; // array lebih aman
handler.limit = true;

module.exports = handler;

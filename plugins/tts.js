const gTTS = require('gtts');
const fs = require('fs');
const path = require('path');

let handler = async (m, { sock, text, usedPrefix, command }) => {
  if (!text) throw `Contoh: ${usedPrefix + command} Halo dunia`;
  if (text.length > 500) throw `Teks kepanjangan, maksimal 500 karakter!`;

  // acak bahasa biar suaranya beda-beda
  const langList = ['id', 'en', 'ja', 'ko', 'es', 'fr', 'ar', 'ru'];
  const randomLang = langList[Math.floor(Math.random() * langList.length)];

  const fileName = `./tmp/tts-${Date.now()}.mp3`;
  
  m.reply(`_Sedang membuat audio..._ [${randomLang}]`);

  try {
    // bikin folder tmp kalo belum ada
    if (!fs.existsSync('./tmp')) fs.mkdirSync('./tmp');

    // generate TTS
    const gtts = new gTTS(text, randomLang);
    await new Promise((resolve, reject) => {
      gtts.save(fileName, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // kirim sebagai voice note
    await sock.sendMessage(m.chat, {
      audio: { url: fileName },
      mimetype: 'audio/mpeg',
      ptt: true // biar jadi voice note, bukan file mp3
    }, { quoted: m });

    // hapus file abis kirim biar ga numpuk
    setTimeout(() => {
      if (fs.existsSync(fileName)) fs.unlinkSync(fileName);
    }, 5000);

  } catch (e) {
    console.log(e);
    m.reply('Gagal bikin audio, coba lagi atau teksnya kepanjangan.');
  }
};

handler.help = ['tts'];
handler.tags = ['tools'];
handler.command = /^(tts|ngomong)$/i;
handler.limit = true;

module.exports = handler;
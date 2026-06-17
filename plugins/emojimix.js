const axios = require("axios");

let handler = async (m, { sock, text }) => {
  if (!text) return m.reply(`Contoh:\n${m.cmd} 😹+😭`);

  let [emoji1, emoji2] = text.split("+");
  if (!emoji1 || !emoji2) {
    return m.reply(`Contoh:\n${m.cmd} 😹+😭`);
  }

  try {
    const url = `https://api.siputzx.my.id/api/tools/emojimix?emoji1=${encodeURIComponent(emoji1)}&emoji2=${encodeURIComponent(emoji2)}`;

    await sock.sendSticker(
      m.chat,
      url,
      m,
      {
        packname: global.packname,
        author: global.author
      }
    );

  } catch (e) {
    console.log(e);
    m.reply("❌ Gagal membuat EmojiMix");
  }
};

handler.help = ["emojimix"];
handler.tags = ["sticker"];
handler.command = ["emojimix", "emix"];

module.exports = handler;

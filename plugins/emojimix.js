const axios = require("axios");

let handler = async (m, { sock, text }) => {
  if (!text) {
    return m.reply(`*Contoh :*\n${m.cmd} 😎+🔥`);
  }

  const [emoji1, emoji2] = text.split("+");

  if (!emoji1 || !emoji2) {
    return m.reply(`*Contoh :*\n${m.cmd} 😎+🔥`);
  }

  try {
    const { data } = await axios.get(
      `https://api.siputzx.my.id/api/tools/emojimix?emoji1=${encodeURIComponent(emoji1)}&emoji2=${encodeURIComponent(emoji2)}`
    );

    if (!data.status) return m.reply("❌ Emoji tidak didukung.");

    await sock.sendSticker(
      m.chat,
      data.data,
      m,
      {
        packname: global.packname,
        author: global.author
      }
    );

  } catch (e) {
    console.log(e);
    m.reply("❌ Gagal membuat EmojiMix.");
  }
};

handler.help = ["emojimix"];
handler.tags = ["sticker"];
handler.command = ["emojimix", "emix"];

module.exports = handler;
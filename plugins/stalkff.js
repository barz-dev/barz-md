const axios = require("axios");

let handler = async (m, { sock, text }) => {
  if (!text) return m.reply(`*Contoh :*\n${m.cmd} 8408114716`);

  try {
    const { data } = await axios.get(
      `https://api.serverweb.qzz.io/stalk/ff?apikey=skyy&id=${text}`
    );

    if (!data.status || !data.result) {
      return m.reply("❌ ID Free Fire tidak ditemukan.");
    }

    const res = data.result;

    const caption = `
╭─〔 🎮 STALK FREE FIRE 〕
│
├ 👤 Nickname
│ ${res.nickname}
│
├ 🆔 Player ID
│ ${res.player_id}
│
├ 🌍 Region
│ ${res.region}
│
├ 🔑 Open ID
│ ${res.open_id}
│
╰───────────────
`;

    await sock.sendMessage(
      m.chat,
      {
        image: { url: res.img_url },
        caption
      },
      { quoted: m }
    );

  } catch (e) {
    console.log(e);
    m.reply("❌ Gagal mengambil data Free Fire.");
  }
};

handler.help = ["stalkff"];
handler.tags = ["search"];
handler.command = ["stalkff"];

module.exports = handler;
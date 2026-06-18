const axios = require("axios");

let handler = async (m, { sock }) => {
  const url = (m.text || "").trim();

  if (!url || !url.includes("capcut")) {
    return m.reply(
`✂️ *ᴄᴀᴘᴄᴜᴛ ᴅʟ*

> ${m.cmd} <link capcut>

*Contoh:*
> ${m.cmd} https://www.capcut.com/template-detail/7630294683419282696`
    );
  }

  await m.react("🕕");

  try {
    const { data } = await axios.get(
      `https://api.nexray.eu.cc/downloader/v2/capcut?url=${encodeURIComponent(url)}`,
      {
        timeout: 30000
      }
    );

    if (!data.status) {
      throw new Error(data.result || data.error || "Template tidak ditemukan");
    }

    const res = data.result;

    const caption = `
✂️ *CAPCUT DOWNLOADER*

📌 *Title:* ${res.title}
⏱️ *Duration:* ${res.duration}
❤️ *Likes:* ${res.likes}
📈 *Usage:* ${res.usage}

👤 *Author:* ${res.author?.name || "-"}
📝 *Description:* ${res.description || "-"}
`.trim();

    await sock.sendMessage(
      m.chat,
      {
        image: { url: res.thumbnail },
        caption
      },
      { quoted: m }
    );

    await sock.sendMessage(
      m.chat,
      {
        video: { url: res.url },
        mimetype: "video/mp4",
        fileName: `${res.title}.mp4`,
        caption: `✅ ${res.title}`
      },
      { quoted: m }
    );

    await m.react("✅");

  } catch (e) {
    console.error(e);
    await m.react("❌");
    m.reply(`❌ Gagal download CapCut\n\n${e.message}`);
  }
};

handler.command = ["capcut", "capcutdl", "ccdl"];
handler.help = ["capcut <url>"];
handler.tags = ["download"];

module.exports = handler;
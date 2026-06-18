const axios = require("axios");

let handler = async (m, { sock, text }) => {
  try {
    await m.react("🎨");

    // Ambil random anime dari API
    const { data } = await axios.get(
      "https://api.jikan.moe/v4/random/anime",
      { timeout: 10000 }
    );

    if (!data.data) {
      return m.reply("❌ Gagal mengambil data anime");
    }

    const anime = data.data;

    const caption = `🎌 *RANDOM ANIME*

📌 *Judul:* ${anime.title || anime.title_english || "N/A"}
🌍 *English:* ${anime.title_english || "N/A"}
📅 *Tahun:* ${anime.year || "N/A"}
⭐ *Score:* ${anime.score || "N/A"}
👥 *Ranked:* #${anime.rank || "N/A"}
📺 *Status:* ${anime.status || "N/A"}
🎬 *Episode:* ${anime.episodes || "N/A"}
🏢 *Studio:* ${anime.studios?.[0]?.name || "N/A"}
📝 *Genre:* ${anime.genres?.map(g => g.name).join(", ") || "N/A"}
📖 *Type:* ${anime.type || "N/A"}

📌 *Synopsis:*
${(anime.synopsis || "").substring(0, 250)}...

🔗 ${anime.url || ""}`;

    if (anime.images?.jpg?.image_url) {
      await sock.sendMessage(
        m.chat,
        {
          image: { url: anime.images.jpg.image_url },
          caption
        },
        { quoted: m }
      );
    } else {
      await m.reply(caption);
    }

    await m.react("✅");

  } catch (e) {
    console.error(e);
    await m.react("❌");
    m.reply(`❌ Error: ${e.message}`);
  }
};

handler.command = ["animerandom", "randomanime"];
handler.help = ["animerandom"];
handler.tags = ["fun"];

module.exports = handler;

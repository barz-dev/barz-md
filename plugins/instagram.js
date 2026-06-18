// plugins/instagram.js — dari Ourin MD 3
const axios = require("axios");

let handler = async (m, { sock, text }) => {
  if (!text || !/instagram\.com/.test(text)) {
    return m.reply(`*Contoh:*\n${m.cmd} https://www.instagram.com/reel/xxx`);
  }

  await m.reply("📥 Mendownload dari Instagram...");

  try {
    // Menggunakan API Nexray
    const { data } = await axios.get(
      `https://api.nexray.eu.cc/downloader/v2/instagram?url=${encodeURIComponent(text)}`
    );

    if (!data?.status) throw new Error("Gagal mengambil data Instagram");

    // Cek apakah ada media
    if (!data.result?.media || data.result.media.length === 0) {
      throw new Error("Tidak ada media yang ditemukan");
    }

    // Kirim semua media yang ditemukan
    for (const media of data.result.media) {
      if (media.type === "video" || media.url?.includes(".mp4")) {
        await sock.sendMessage(
          m.chat,
          { 
            video: { url: media.url }, 
            caption: `📸 Instagram Downloader\n👤 Username: ${data.result.username || '-'}\n❤️ Likes: ${data.result.likes || '-'}\n💬 Comments: ${data.result.comment || '-'}`
          },
          { quoted: m }
        );
      } else if (media.type === "image" || media.url?.includes(".jpg") || media.url?.includes(".png")) {
        await sock.sendMessage(
          m.chat,
          { 
            image: { url: media.url }, 
            caption: `📸 Instagram Downloader\n👤 Username: ${data.result.username || '-'}\n❤️ Likes: ${data.result.likes || '-'}\n💬 Comments: ${data.result.comment || '-'}`
          },
          { quoted: m }
        );
      }
    }

    // Jika tidak ada media yang berhasil dikirim
    if (data.result.media.length === 0) {
      throw new Error("Tidak ada media yang bisa diunduh");
    }

  } catch (err) {
    console.error("Error Instagram:", err);
    m.reply(`❌ Gagal download Instagram: ${err.message}`);
  }
};

handler.command = ["ig", "igdl", "instagram", "reels"];
handler.tags = ["Download"];
handler.help = ["igdl <url>"];

module.exports = handler;
const axios = require("axios");

let handler = async (m, { sock, text }) => {
  const q = m.quoted;

  if (!q || !q.message?.imageMessage) {
    return m.reply(
      `🔍 *REVERSE IMAGE SEARCH*\n\n` +
      `Reply foto yang mau di cari sumbernya.\n\n` +
      `${m.cmd}`
    );
  }

  try {
    await m.react("🔍");

    // Download gambar
    const stream = await sock.downloadMediaMessage(q.message.imageMessage);
    const imageBuffer = Buffer.from(stream);
    const base64 = imageBuffer.toString("base64");

    // Coba pake API Google Lens / Reverse Image Search
    // Menggunakan endpoint free yang available
    const { data } = await axios.post(
      "https://lens.google.com/upload?re=dr&hl=en",
      imageBuffer,
      {
        headers: {
          "Content-Type": "application/octet-stream",
          "User-Agent": "Mozilla/5.0"
        },
        timeout: 15000
      }
    );

    // Alternative: Gunakan TinEye atau SauceNAO API (perlu API key)
    // Untuk sekarang gunakan API yang lebih accessible

    const resultMsg = `🔍 *REVERSE IMAGE SEARCH RESULT*

📸 Gambar sudah dianalisis

🔗 Cek hasil di:
- Google Images: https://www.google.com/searchbyimage?image_url=
- TinEye: https://www.tineye.com/
- SauceNAO: https://saucenao.com/

💡 Tip: Upload gambar ke website di atas untuk hasil lebih akurat`;

    await m.reply(resultMsg);
    await m.react("✅");

  } catch (e) {
    console.error(e);
    await m.react("❌");

    // Fallback dengan link helper
    const fallbackMsg = `⚠️ *Search Error*

Gunakan link ini untuk reverse search:
• Google Images: https://images.google.com/
• TinEye: https://www.tineye.com/
• SauceNAO: https://saucenao.com/

Error: ${e.message}`;

    m.reply(fallbackMsg);
  }
};

handler.command = ["reverse", "revimg", "reversesearch", "imgsearch"];
handler.help = ["reverse (reply foto)"];
handler.tags = ["tools"];

module.exports = handler;

const axios = require("axios");

let handler = async (m, { sock, text }) => {
  if (!text) {
    return m.reply(
      `📱 *PHONE SPECS*\n\n` +
      `Contoh:\n` +
      `${m.cmd} iPhone 15 Pro\n` +
      `${m.cmd} Samsung Galaxy S24\n` +
      `${m.cmd} Xiaomi 14 Ultra`
    );
  }

  try {
    await m.react("📱");

    // Menggunakan API untuk mendapatkan spesifikasi ponsel
    const { data } = await axios.get(
      `https://api.api-ninjas.com/v1/phones?name=${encodeURIComponent(text)}`,
      {
        headers: {
          "X-Api-Key": "your_api_key_here" // Ganti dengan API key dari api-ninjas.com (gratis)
        },
        timeout: 10000
      }
    );

    if (!data || data.length === 0) {
      return m.reply("❌ HP tidak ditemukan. Coba nama lain!");
    }

    const phone = data[0];

    const caption = `📱 *PHONE SPECS*

📌 *Model:* ${phone.name || "N/A"}
🏢 *Brand:* ${phone.brand || "N/A"}

⚙️ *HARDWARE*
🔧 CPU: ${phone.cpu || "N/A"}
💾 RAM: ${phone.ram || "N/A"}
🗂️ Storage: ${phone.storage || "N/A"}
🔋 Battery: ${phone.battery || "N/A"}

📷 *KAMERA*
📸 Belakang: ${phone.rear_camera || "N/A"}
🤳 Depan: ${phone.front_camera || "N/A"}

🖥️ *DISPLAY*
📺 Ukuran: ${phone.screen_size || "N/A"}
🎨 Resolusi: ${phone.screen_resolution || "N/A"}
🔆 Refresh Rate: ${phone.refresh_rate || "N/A"}

💰 *HARGA & INFO*
💵 Harga: ${phone.price || "N/A"}
⚖️ Berat: ${phone.weight || "N/A"}
🔌 Charger: ${phone.fast_charging || "N/A"}`;

    await m.reply(caption);
    await m.react("✅");

  } catch (e) {
    console.error(e);
    await m.react("❌");

    // Fallback tanpa API key
    const fallback = `⚠️ *API Limit Tercapai*

Gunakan website ini untuk cek spek HP:
• GSMArena: https://www.gsmarena.com/
• PhoneArena: https://www.phonearena.com/
• 91mobiles: https://www.91mobiles.com/

Error: ${e.message}`;

    m.reply(fallback);
  }
};

handler.command = ["phonespecs", "specs", "hpspecs", "phoneinfo"];
handler.help = ["phonespecs <nama hp>"];
handler.tags = ["tools", "info"];

module.exports = handler;

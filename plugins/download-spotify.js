const axios = require("axios");

async function spotifyDl(query) {
    const { data } = await axios.get(
        `https://api.nexray.eu.cc/downloader/spotify?url=${encodeURIComponent(query)}`,
        {
            timeout: 60000,
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        }
    );

    return data;
}

let handler = async (m, { sock }) => {
    const text = (m.text || "").trim();

    if (!text) {
        return m.reply(
`🎵 *SPOTIFY DOWNLOADER*

Contoh:

.spotify bergema
.spotify penjaga hati
.spotify https://open.spotify.com/track/xxxx`
        );
    }

    try {
        await m.react("🎵");

        const res = await spotifyDl(text);

        if (!res.status)
            return m.reply("❌ Lagu tidak ditemukan");

        const result = res.result;

        if (!result?.url)
            return m.reply("❌ URL audio tidak ditemukan");

        const caption = `🎵 *${result.title}*

👤 Artist : ${result.artist}
⚡ Source : Nexray`;

        await sock.sendMessage(
            m.chat,
            {
                audio: { url: result.url },
                mimetype: "audio/mpeg",
                fileName: `${result.title}.mp3`,
                ptt: false
            },
            { quoted: m }
        );

        await m.reply(caption);
        await m.react("✅");

    } catch (e) {
        console.error(e);
        await m.react("❌");
        m.reply(`❌ ${e.message}`);
    }
};

handler.command = ["spotify", "spotifydl", "spt"];
handler.help = ["spotify <judul/link>"];
handler.tags = ["download"];

module.exports = handler;
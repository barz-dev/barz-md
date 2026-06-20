const yts = require("yt-search");
const axios = require("axios");

function formatViews(n) {
    if (!n) return "0";
    if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
    return n.toString();
}

// API Spotify Nexray
async function spotifyDl(query) {
    const { data } = await axios.get(
        `https://api.nexray.eu.cc/downloader/spotify?url=${encodeURIComponent(query)}`,
        { timeout: 60000, headers: {"User-Agent": "Mozilla/5.0"} }
    );
    return data;
}

let handler = async (m, { sock, text }) => {
    if (!text) {
        return m.reply(`🎵 *PLAY MUSIC*\n\nContoh:\n${m.cmd} bergema`);
    }

    try {
        await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

        // 1. Search YT dulu buat ambil data + thumbnail
        const search = await yts(text);
        if (!search.videos.length) {
            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return m.reply("❌ Lagu tidak ditemukan");
        }
        const video = search.videos[0];

        // 2. Download audio pake Spotify tapi query nya judul YT
        const res = await spotifyDl(video.title);
        if (!res.status ||!res.result?.url) {
            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return m.reply("❌ Audio Spotify tidak ditemukan");
        }
        const audioData = res.result;

        const caption = `
🎵 *PLAY MUSIC*

📌 *Title :* ${video.title}
👤 *Channel :* ${video.author.name}
⏱️ *Duration :* ${video.timestamp}
👀 *Views :* ${formatViews(video.views)}
📅 *Upload :* ${video.ago}

🔗 ${video.url}
`.trim();

        // 3. Kirim thumbnail YT
        const thumbMsg = await sock.sendMessage(
            m.chat,
            { image: { url: video.thumbnail }, caption },
            { quoted: m }
        );

        // 4. Kirim audio Spotify - file kecil anti ENOSPC
        await sock.sendMessage(
            m.chat,
            {
                audio: { url: audioData.url },
                mimetype: "audio/mpeg",
                ptt: false,
                fileName: `${video.title}.mp3`
            },
            { quoted: thumbMsg }
        );

        await sock.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.log(e);
        await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        m.reply(`❌ Error\n${e.message}`);
    }
};

handler.command = ["play", "playaudio"];
handler.help = ["play <judul lagu>"];
handler.tags = ["downloader"];

module.exports = handler;

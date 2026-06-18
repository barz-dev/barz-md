const yts = require("yt-search");
const axios = require("axios");

function formatViews(n) {
    if (!n) return "0";
    if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
    return n.toString();
}

async function getAudio(query) {

    const { data } = await axios.get(
        `https://api.nexray.eu.cc/downloader/ytplayvid?q=${encodeURIComponent(query)}`,
        { timeout: 30000 }
    );

    if (!data.status) {
        throw new Error("Lagu tidak ditemukan");
    }

    return data.result;
}

let handler = async (m, { sock, text }) => {

    if (!text) {
        return m.reply(
            `🎵 *PLAY MUSIC*\n\n` +
            `Contoh:\n` +
            `${m.cmd} bergema`
        );
    }

    try {

        const search = await yts(text);

        if (!search.videos.length) {
            return m.reply("❌ Lagu tidak ditemukan");
        }

        const video = search.videos[0];

        const res = await getAudio(text);

        const caption = `
🎵 *PLAY MUSIC*

📌 *Title :* ${video.title}
👤 *Channel :* ${video.author.name}
⏱️ *Duration :* ${video.timestamp}
👀 *Views :* ${formatViews(video.views)}
📅 *Upload :* ${video.ago}

🔗 ${video.url}
`.trim();

        const thumbMsg = await sock.sendMessage(
            m.chat,
            {
                image: {
                    url: video.thumbnail
                },
                caption
            },
            {
                quoted: m
            }
        );

        await sock.sendMessage(
            m.chat,
            {
                audio: {
                    url: res.download_url || res.url
                },
                mimetype: "audio/mpeg",
                ptt: false,
                fileName: `${video.title}.mp3`
            },
            {
                quoted: thumbMsg
            }
        );

    } catch (e) {

        console.log(e);

        if (e.message.includes("ENOSPC")) {
            return m.reply(
                "❌ Storage server penuh (ENOSPC).\n\nCek disk panel atau bersihkan cache."
            );
        }

        m.reply(
            `❌ Error\n\n${e.message}`
        );
    }
};

handler.command = ["play", "playaudio"];
handler.help = ["play <judul lagu>"];
handler.tags = ["downloader"];

module.exports = handler;
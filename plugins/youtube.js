const axios = require("axios");

let handler = async (m, { sock, text, command }) => {
    if (!text) {
        return m.reply(
            `*Contoh :*\n` +
            `.play bergema\n` +
            `.play2 bergema\n` +
            `.ytmp3 https://youtu.be/gvunApwKIiY\n` +
            `.ytmp4 https://youtu.be/gvunApwKIiY`
        );
    }

    try {

        // PLAY AUDIO
        if (command === "play") {

            let { data } = await axios.get(
                `https://api.nexray.eu.cc/downloader/ytplayvid?q=${encodeURIComponent(text)}`
            );

            if (!data.status) return m.reply("Lagu tidak ditemukan");

            let res = data.result;

            await sock.sendMessage(
                m.chat,
                {
                    image: { url: res.thumbnail },
                    caption: `
*🎵 PLAY MUSIC*

📌 *Title :* ${res.title}
👤 *Channel :* ${res.channel}
⏱️ *Duration :* ${res.duration}
👀 *Views :* ${res.views}
📅 *Upload :* ${res.upload_at}
                    `.trim()
                },
                { quoted: m }
            );

            return await sock.sendMessage(
                m.chat,
                {
                    audio: { url: res.download_url },
                    mimetype: "audio/mpeg",
                    fileName: `${res.title}.mp3`
                },
                { quoted: m }
            );
        }

        // PLAY VIDEO
        if (command === "play2") {

            let { data } = await axios.get(
                `https://api.nexray.eu.cc/downloader/ytplayvid?q=${encodeURIComponent(text)}`
            );

            if (!data.status) return m.reply("Video tidak ditemukan");

            let res = data.result;

            return await sock.sendMessage(
                m.chat,
                {
                    video: { url: res.download_url },
                    caption: `
*🎬 PLAY VIDEO*

📌 *Title :* ${res.title}
👤 *Channel :* ${res.channel}
⏱️ *Duration :* ${res.duration}
👀 *Views :* ${res.views}
                    `.trim()
                },
                { quoted: m }
            );
        }

        // YTMP3
        if (command === "ytmp3") {

            let { data } = await axios.get(
                `https://api.nexray.eu.cc/downloader/ytmp3?url=${encodeURIComponent(text)}`
            );

            if (!data.status) return m.reply("Gagal mengambil audio");

            let res = data.result || data;

            return await sock.sendMessage(
                m.chat,
                {
                    audio: {
                        url: res.download_url || res.url
                    },
                    mimetype: "audio/mpeg",
                    fileName: `${res.title || "audio"}.mp3`
                },
                { quoted: m }
            );
        }

        // YTMP4
        if (command === "ytmp4") {

            let { data } = await axios.get(
                `https://api.nexray.eu.cc/downloader/ytmp4?url=${encodeURIComponent(text)}&resolusi=720`
            );

            if (!data.status) return m.reply("Gagal mengambil video");

            let res = data.result || data;

            return await sock.sendMessage(
                m.chat,
                {
                    video: {
                        url: res.download_url || res.url
                    },
                    caption: res.title || "YTMP4 Downloader"
                },
                { quoted: m }
            );
        }

    } catch (e) {
        console.log(e);
        m.reply(`Error:\n${e.message}`);
    }
};

handler.command = ["play", "play2", "ytmp3", "ytmp4"];
handler.help = ["play", "play2", "ytmp3", "ytmp4"];
handler.tags = ["downloader"];

module.exports = handler;
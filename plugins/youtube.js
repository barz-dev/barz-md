const axios = require("axios");
const fs = require("fs");
const path = require("path");

function clearTmp() {
    const dirs = ["./tmp", "./temp", "./cache"];

    for (const dir of dirs) {
        try {
            if (!fs.existsSync(dir)) continue;

            for (const file of fs.readdirSync(dir)) {
                const filePath = path.join(dir, file);

                try {
                    if (fs.statSync(filePath).isFile()) {
                        fs.unlinkSync(filePath);
                    }
                } catch {}
            }
        } catch {}
    }
}

let handler = async (m, { sock, text, command }) => {
    if (!text) {
        return m.reply(
            `*Contoh :*\n` +
            `.play bergema\n` +
            `.play2 bergema\n` +
            `.ytmp3 https://youtu.be/xxxx\n` +
            `.ytmp4 https://youtu.be/xxxx`
        );
    }

    try {

        await m.react("⏱️");

        // PLAY AUDIO
        if (command === "play") {

            let { data } = await axios.get(
                `https://api.nexray.eu.cc/downloader/ytplayvid?q=${encodeURIComponent(text)}`,
                { timeout: 30000 }
            );

            if (!data?.status) return m.reply("❌ Lagu tidak ditemukan");

            let res = data.result;

            const thumb = await sock.sendMessage(
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

            await sock.sendMessage(
                m.chat,
                {
                    audio: {
                        url: res.audio ||
                             res.audio_url ||
                             res.download_url ||
                             res.url
                    },
                    mimetype: "audio/mpeg",
                    fileName: `${res.title}.mp3`
                },
                {
                    quoted: thumb
                }
            );

            await m.react("✅");
        }

        // PLAY VIDEO
        else if (command === "play2") {

            let { data } = await axios.get(
                `https://api.nexray.eu.cc/downloader/ytplayvid?q=${encodeURIComponent(text)}`,
                { timeout: 30000 }
            );

            if (!data?.status) return m.reply("❌ Video tidak ditemukan");

            let res = data.result;

            await sock.sendMessage(
                m.chat,
                {
                    video: {
                        url: res.video ||
                             res.download_url ||
                             res.url
                    },
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

            await m.react("✅");
        }

        // YTMP3
        else if (command === "ytmp3") {

            let { data } = await axios.get(
                `https://api.nexray.eu.cc/downloader/ytmp3?url=${encodeURIComponent(text)}`,
                { timeout: 30000 }
            );

            if (!data?.status) return m.reply("❌ Gagal mengambil audio");

            let res = data.result || data;

            const thumb = await sock.sendMessage(
                m.chat,
                {
                    image: {
                        url: res.thumbnail || res.thumb
                    },
                    caption: `
*🎵 YTMP3 DOWNLOADER*

📌 ${res.title || "Unknown"}
                    `.trim()
                },
                { quoted: m }
            );

            await sock.sendMessage(
                m.chat,
                {
                    audio: {
                        url: res.download_url ||
                             res.audio ||
                             res.url
                    },
                    mimetype: "audio/mpeg",
                    fileName: `${res.title || "audio"}.mp3`
                },
                {
                    quoted: thumb
                }
            );

            await m.react("✅");
        }

        // YTMP4
        else if (command === "ytmp4") {

            let { data } = await axios.get(
                `https://api.nexray.eu.cc/downloader/ytmp4?url=${encodeURIComponent(text)}&resolusi=720`,
                { timeout: 30000 }
            );

            if (!data?.status) return m.reply("❌ Gagal mengambil video");

            let res = data.result || data;

            await sock.sendMessage(
                m.chat,
                {
                    video: {
                        url: res.download_url ||
                             res.video ||
                             res.url
                    },
                    caption: res.title || "YTMP4 Downloader"
                },
                { quoted: m }
            );

            await m.react("✅");
        }

    } catch (e) {

        console.log(e);

        if (
            e.message.includes("ENOSPC") ||
            e.message.includes("no space left")
        ) {
            clearTmp();

            return m.reply(
                "❌ error asu."
            );
        }

        await m.react("❌");
        m.reply(`Error:\n${e.message}`);

    } finally {

        clearTmp();

    }
};

handler.command = ["play", "play2", "ytmp3", "ytmp4"];
handler.help = ["play", "play2", "ytmp3", "ytmp4"];
handler.tags = ["downloader"];

module.exports = handler;

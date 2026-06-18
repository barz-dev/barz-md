const yts = require("yt-search");
const axios = require("axios");
const sharp = require("sharp");
const { generateWAMessageFromContent } = require("badzz88/baileys");

async function getAudioDownload(url) {
    try {
        const { data } = await axios.get(
            `https://api.nexray.eu.cc/downloader/v1/ytmp3?url=${encodeURIComponent(url)}`
        );

        const download = data?.result?.url;
        const title = data?.result?.title;

        if (download) return { download, title };
    } catch {}

    throw new Error("Gagal mendapatkan audio");
}

async function getVideoDownload(url) {
    try {
        const { data } = await axios.get(
            `https://api.nexray.eu.cc/downloader/ytmp4?url=${encodeURIComponent(url)}`
        );

        if (data?.status) {
            return data.result?.url || data.result?.download_url;
        }
    } catch {}

    throw new Error("Gagal mendapatkan video");
}

let handler = async (m, { sock, text, command }) => {

    // YTS
    if (["yts", "ytsearch", "youtubesearch"].includes(command)) {

        if (!text) {
            return m.reply(
                `Contoh:\n${m.prefix}yts komang`
            );
        }

        await m.react("🕕");

        try {

            const searchResults = await yts(text);
            const videos = searchResults.videos;

            if (!videos.length)
                return m.reply("Video tidak ditemukan");

            const video = videos[0];

            const imageResponse = await axios.get(
                video.thumbnail,
                { responseType: "arraybuffer" }
            );

            const thumbnailBuffer = await sharp(imageResponse.data)
                .resize(300, 170)
                .jpeg()
                .toBuffer();

            const content = {
                buttonsMessage: {
                    contentText:
`🎬 *YOUTUBE SEARCH*

📌 ${video.title}
👤 ${video.author.name}
⏱️ ${video.timestamp}
👀 ${video.views}
📅 ${video.ago}

🔗 ${video.url}`,

                    footerText: "Barz MD",

                    locationMessage: {
                        jpegThumbnail: thumbnailBuffer,
                        name: video.title,
                        address: `${video.author.name}`
                    },

                    buttons: [
                        {
                            buttonId: `.ytmp3 ${video.url}`,
                            buttonText: {
                                displayText: "🎵 Audio"
                            },
                            type: 1
                        },
                        {
                            buttonId: `.ytmp4 ${video.url}`,
                            buttonText: {
                                displayText: "🎥 Video"
                            },
                            type: 1
                        }
                    ],

                    headerType: 6
                }
            };

            const msg = generateWAMessageFromContent(
                m.chat,
                content,
                { quoted: m }
            );

            await sock.relayMessage(
                m.chat,
                msg.message,
                { messageId: msg.key.id }
            );

            await m.react("✅");

        } catch (e) {
            console.log(e);
            m.react("❌");
            m.reply("Gagal mencari video.");
        }

        return;
    }

    // YTMP3
    if (["ytmp3", "ytaudio"].includes(command)) {

        if (!text)
            return m.reply(
                `Contoh:\n${m.prefix}ytmp3 https://youtube.com/watch?v=xxx`
            );

        await m.react("🕕");

        try {

            const result = await getAudioDownload(text);

            await sock.sendMessage(
                m.chat,
                {
                    audio: {
                        url: result.download
                    },
                    mimetype: "audio/mpeg",
                    fileName: `${result.title || "audio"}.mp3`
                },
                { quoted: m }
            );

            await m.react("✅");

        } catch (e) {
            console.log(e);
            m.react("❌");
            m.reply("Gagal mengunduh audio.");
        }

        return;
    }

    // YTMP4
    if (["ytmp4", "ytvideo"].includes(command)) {

        if (!text)
            return m.reply(
                `Contoh:\n${m.prefix}ytmp4 https://youtube.com/watch?v=xxx`
            );

        await m.react("🕕");

        try {

            const downloadUrl = await getVideoDownload(text);

            await sock.sendMessage(
                m.chat,
                {
                    video: {
                        url: downloadUrl
                    },
                    caption: "✅ Video berhasil diunduh"
                },
                { quoted: m }
            );

            await m.react("✅");

        } catch (e) {
            console.log(e);
            m.react("❌");
            m.reply("Gagal mengunduh video.");
        }

        return;
    }
};

handler.command = [
    "yts",
    "ytsearch",
    "youtubesearch",
    "ytmp3",
    "ytaudio",
    "ytmp4",
    "ytvideo"
];

handler.help = [
    "yts <query>",
    "ytmp3 <url>",
    "ytmp4 <url>"
];

handler.tags = ["downloader"];

module.exports = handler;
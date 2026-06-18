let handler = async (m, { sock }) => {
    const quoted = m.quoted;

    if (!quoted) {
        return m.reply(
            `Reply pesan View Once.\n\n` +
            `Contoh:\n${m.cmd}`
        );
    }

    try {

        const msg =
            quoted.msg ||
            quoted.message ||
            {};

        const type = Object.keys(msg)[0];

        let media;

        if (type === "viewOnceMessage") {
            media = msg.viewOnceMessage.message;
        } else if (type === "viewOnceMessageV2") {
            media = msg.viewOnceMessageV2.message;
        } else if (type === "viewOnceMessageV2Extension") {
            media = msg.viewOnceMessageV2Extension.message;
        } else {
            return m.reply("❌ Reply pesan View Once.");
        }

        const mediaType = Object.keys(media)[0];
        const mediaMsg = media[mediaType];

        const buffer = await sock.downloadMediaMessage(mediaMsg);

        if (!buffer) {
            return m.reply("❌ Gagal mengambil media.");
        }

        if (/image/i.test(mediaType)) {

            await sock.sendMessage(
                m.chat,
                {
                    image: buffer,
                    caption: mediaMsg.caption || ""
                },
                { quoted: m }
            );

        } else if (/video/i.test(mediaType)) {

            await sock.sendMessage(
                m.chat,
                {
                    video: buffer,
                    caption: mediaMsg.caption || ""
                },
                { quoted: m }
            );

        } else if (/audio/i.test(mediaType)) {

            await sock.sendMessage(
                m.chat,
                {
                    audio: buffer,
                    mimetype: mediaMsg.mimetype || "audio/mpeg",
                    ptt: false
                },
                { quoted: m }
            );

        } else {

            await sock.sendMessage(
                m.chat,
                {
                    document: buffer,
                    mimetype: mediaMsg.mimetype || "application/octet-stream",
                    fileName: `viewonce_${Date.now()}`
                },
                { quoted: m }
            );

        }

    } catch (e) {
        console.log(e);
        m.reply(
            "❌ Gagal membuka View Once.\n\n" +
            e.message
        );
    }
};

handler.command = [
    "rvo",
    "readvo",
    "readviewonce",
    "readview"
];

handler.help = ["rvo"];
handler.tags = ["tools"];

module.exports = handler;
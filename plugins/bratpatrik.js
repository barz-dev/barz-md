let handler = async (m, { sock, text }) => {
    if (!text) {
        return m.reply(
            `🖼️ *ʙʀᴀᴛ ᴘᴀᴛʀɪᴄᴋ*\n\n` +
            `Contoh:\n${m.cmd} Hai semua`
        );
    }

    try {

        await m.react("⏱️");

        const url = `https://api.ourin.my.id/api/bratpatrick?text=${encodeURIComponent(text)}`;

        await sock.sendSticker(
            m.chat,
            url,
            m,
            {
                packname: global.packname || "ʙᴀʀᴢ ᴍᴅ",
                author: global.author || "barz"
            }
        );

        await m.react("✅");

    } catch (e) {

        console.log(e);

        await m.react("❌");

        m.reply(
            `☢️ *Error!*\n\n\`\`\`${e.message}\`\`\``
        );
    }
};

handler.command = ["bratpatrick"];
handler.help = ["bratpatrick <text>"];
handler.tags = ["sticker"];

module.exports = handler;
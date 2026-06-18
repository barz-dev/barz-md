const config = require("../config");

let handler = async (m, { sock, text }) => {
    if (!text) {
        return m.reply(
            `🖼️ *ʙʀᴀᴛ ᴄᴇᴡᴇᴋ sᴛɪᴄᴋᴇʀ*\n\n` +
            `Contoh:\n${m.cmd} Hai semua`
        );
    }

    try {

        await m.react("⏱️");

        const url = `https://api.deline.web.id/maker/cewekbrat?text=${encodeURIComponent(text)}`;

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

handler.command = ["bratcewek", "cewekbrat", "bratperempuan", "bratgirl"];
handler.help = ["bratcewek <text>"];
handler.tags = ["sticker"];

module.exports = handler;
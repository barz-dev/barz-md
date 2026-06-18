const config = require("../config");
const axios = require("axios");

let handler = async (m, { sock, text }) => {
    if (!text) {
        return m.reply(
            `🖼️ *ʙʀᴀᴛ ᴀɴɪᴍᴇ sᴛɪᴄᴋᴇʀ*\n\n` +
            `Contoh:\n${m.cmd} Hai semua`
        );
    }

    try {

        await m.react("⏱️");

        const url = `https://api.nexray.web.id/maker/bratanime?text=${encodeURIComponent(text)}`;

        await sock.sendSticker(
            m.chat,
            url,
            m,
            {
                packname: global.packname || config?.sticker?.packname || "ʙᴀʀᴢ ᴍᴅ",
                author: global.author || config?.sticker?.author || "barz"
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

handler.command = ["bratanime", "animebrat"];
handler.help = ["bratanime <text>"];
handler.tags = ["sticker"];

module.exports = handler;
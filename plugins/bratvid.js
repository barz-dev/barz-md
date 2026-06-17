const axios = require("axios");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { writeExifVid } = require("../lib/sticker");

let handler = async (m, { sock, text }) => {
    if (!text) return m.reply(`*example:*\n${m.cmd} ʙᴀʀᴢ ɢᴀɴᴛᴇɴɢ🥰`);

    let url = `https://api.siputzx.my.id/api/m/brat?text=${encodeURIComponent(text)}&isAnimated=true&delay=500`;

    let res = await axios.get(url, {
        responseType: "arraybuffer"
    });

    let gif = Buffer.from(res.data);

    let sticker = await writeExifVid(gif, {
        packname: global.packname,
        author: global.author
    });

    let file = path.join(
        "./tmp",
        crypto.randomBytes(6).toString("hex") + ".webp"
    );

    fs.writeFileSync(file, sticker);

    await sock.sendMessage(
        m.chat,
        {
            sticker: {
                url: file
            }
        },
        {
            quoted: m
        }
    );

    fs.unlinkSync(file);
};

handler.help = ["bratvid"];
handler.command = ["bratvid"];
handler.tags = ["maker"];

module.exports = handler;

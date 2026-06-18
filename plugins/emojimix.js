const axios = require("axios");

let handler = async (m, { sock, text }) => {
    if (!text) {
        return m.reply(
            `🎭 *EMOJI MIX*\n\n` +
            `Gabungkan 2 emoji menjadi 1\n\n` +
            `Contoh:\n` +
            `${m.cmd} 😂🔥`
        );
    }

    const emojiRegex = /\p{Extended_Pictographic}/gu;
    const emojis = text.match(emojiRegex);

    if (!emojis || emojis.length < 2) {
        return m.reply(
            `❌ Masukkan minimal 2 emoji!\n\n` +
            `Contoh:\n${m.cmd} 😂🔥`
        );
    }

    const emoji1 = emojis[0];
    const emoji2 = emojis[1];

    try {

        const { data } = await axios.get(
            `https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`
        );

        if (!data.results || !data.results.length) {
            return m.reply("❌ Kombinasi emoji tidak ditemukan!");
        }

        const imageUrl = data.results[0].url;

        await sock.sendSticker(
            m.chat,
            imageUrl,
            m,
            {
                packname: global.packname,
                author: global.author
            }
        );

    } catch (e) {
        console.log(e);
        m.reply(`Error:\n${e.message}`);
    }
};

handler.command = ["emojimix", "mixemoji", "emix"];
handler.help = ["emojimix 😂🔥"];
handler.tags = ["sticker"];

module.exports = handler;
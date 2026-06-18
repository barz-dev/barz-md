const axios = require("axios");

const COLORS = {
    pink: "#f68ac9",
    blue: "#6cace4",
    red: "#f44336",
    green: "#4caf50",
    yellow: "#ffeb3b",
    purple: "#9c27b0",
    darkblue: "#0d47a1",
    lightblue: "#03a9f4",
    ash: "#9e9e9e",
    orange: "#ff9800",
    black: "#000000",
    white: "#ffffff",
    teal: "#008080",
    lightpink: "#FFC0CB",
    chocolate: "#A52A2A",
    salmon: "#FFA07A",
    magenta: "#FF00FF",
    tan: "#D2B48C",
    wheat: "#F5DEB3",
    deeppink: "#FF1493",
    fire: "#B22222",
    skyblue: "#00BFFF",
    brightskyblue: "#1E90FF",
    hotpink: "#FF69B4",
    lightskyblue: "#87CEEB",
    seagreen: "#20B2AA",
    darkred: "#8B0000",
    orangered: "#FF4500",
    cyan: "#48D1CC",
    violet: "#BA55D3",
    mossgreen: "#00FF7F",
    darkgreen: "#008000",
    navyblue: "#191970",
    darkorange: "#FF8C00",
    darkpurple: "#9400D3",
    fuchsia: "#FF00FF",
    darkmagenta: "#8B008B",
    darkgray: "#2F4F4F",
    peachpuff: "#FFDAB9",
    darkishgreen: "#BDB76B",
    darkishred: "#DC143C",
    goldenrod: "#DAA520",
    darkishgray: "#696969",
    darkishpurple: "#483D8B",
    gold: "#FFD700",
    silver: "#C0C0C0"
};

const DEFAULT_PP = "https://files.catbox.moe/nwvkbt.png";

async function getProfilePicture(sock, jid) {
    try {
        return await sock.profilePictureUrl(jid, "image");
    } catch {
        return DEFAULT_PP;
    }
}

let handler = async (m, { sock, args }) => {

    if (args.length < 2 && !m.quoted) {
        return m.reply(
            `💬 *QUOTE STICKER*\n\n` +
            `Contoh:\n` +
            `${m.cmd} pink Halo semuanya\n\n` +
            `Atau reply pesan:\n` +
            `${m.cmd} pink`
        );
    }

    const color = (args[0] || "").toLowerCase();
    const backgroundColor = COLORS[color];

    if (!backgroundColor) {
        return m.reply(
            `❌ Warna tidak ditemukan.\n\n` +
            `Contoh warna:\n` +
            `pink, blue, red, green, black, white, gold`
        );
    }

    let text = args.slice(1).join(" ");

    if (m.quoted && !text) {
        text =
            m.quoted.text ||
            m.quoted.body ||
            m.quoted.caption ||
            "";
    }

    if (!text) return m.reply("❌ Teks tidak ditemukan.");

    if (text.length > 80) {
        return m.reply(
            `❌ Maksimal 80 karakter.\n\n` +
            `Karakter sekarang: ${text.length}`
        );
    }

    try {

        const avatar = await getProfilePicture(sock, m.sender);

        const payload = {
            messages: [{
                from: {
                    id: 1,
                    first_name: m.pushName || "User",
                    last_name: "",
                    name: "",
                    photo: {
                        url: avatar
                    }
                },
                text,
                entities: [],
                avatar: true,
                media: {
                    url: ""
                },
                mediaType: "",
                replyMessage: {}
            }],
            backgroundColor,
            width: 512,
            height: 512,
            scale: 2,
            type: "quote",
            format: "png",
            emojiStyle: "apple"
        };

        const { data } = await axios.post(
            "https://brat.siputzx.my.id/quoted",
            payload,
            {
                responseType: "arraybuffer",
                timeout: 60000
            }
        );

        const buffer = Buffer.from(data);

        await sock.sendSticker(
            m.chat,
            buffer,
            m,
            {
                packname: global.packname || "Barz MD",
                author: global.author || "Barz"
            }
        );

    } catch (e) {
        console.log(e);
        m.reply(`Error:\n${e.message}`);
    }
};

handler.command = ["qc", "qcstc", "stcqc", "qcstic", "qcstick", "quotesticker"];
handler.help = ["qc pink halo"];
handler.tags = ["sticker"];

module.exports = handler;
let handler = async (m, { sock }) => {
    const quoted = m.quoted;
    if (!quoted) return m.reply('Reply pesan View Once!');

    try {
        let msg = quoted;
        let viewOnceMsg = msg.viewOnceMessageV2?.message || 
                         msg.viewOnceMessage?.message || 
                         msg.viewOnceMessageV2Extension?.message;
        
        if (!viewOnceMsg) return m.reply('❌ Bukan View Once!');

        let type = Object.keys(viewOnceMsg)[0];
        let media = viewOnceMsg[type];
        
        let buffer = await sock.downloadMediaMessage(media);
        if (!buffer) return m.reply('❌ Gagal download!');

        if (type === 'imageMessage') {
            await sock.sendMessage(m.chat, { image: buffer, caption: media.caption || '' }, { quoted: m });
        } else if (type === 'videoMessage') {
            await sock.sendMessage(m.chat, { video: buffer, caption: media.caption || '' }, { quoted: m });
        } else if (type === 'audioMessage') {
            await sock.sendMessage(m.chat, { audio: buffer, mimetype: 'audio/mpeg' }, { quoted: m });
        } else {
            await sock.sendMessage(m.chat, { document: buffer, fileName: `viewonce_${Date.now()}` }, { quoted: m });
        }

    } catch (e) {
        m.reply('❌ Gagal: ' + e.message);
    }
};

handler.command = ['rvo', 'readvo'];
handler.tags = ['tools'];
handler.help = ['rvo'];

module.exports = handler;

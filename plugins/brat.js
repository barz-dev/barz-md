const fs = require("fs");

let handler = async (m, { sock, text }) => {
  if (!text) return m.reply(`*example:*\n${m.cmd} ʙᴀʀᴢ ɢᴀɴᴛᴇɴɢ🥰`);
  
  let barz = `https://api.siputzx.my.id/api/m/brat?text=${text}&delay=500}`
  
  // Gunakan global.packname yang sudah didefinisikan
  await sock.sendSticker(m.chat, barz, m, { 
    packname: global.packname,
    author: global.author 
  });
}

handler.help = "brat";
handler.command = ["brat"];
handler.tags = "Main";

module.exports = handler;

const axios = require("axios") // jangan lupa axios buat fetch gambar

let handler = async (m, { sock, text }) => {
  if (!text) return m.reply(`*Contoh:*\n${m.cmd} ʙᴀʀᴢ ɢᴀɴᴛᴇɴɢ🥰`)
  
  let barz = `https://api.ikyyxd.my.id/maker/bratbahlil?text=${encodeURIComponent(text)}`
  
  try {
    await sock.sendSticker(m.chat, barz, m, { 
      packname: global.packname,
      author: global.author 
    })
  } catch(e) {
    m.reply("Gagal bikin sticker: " + e.message)
  }
}

handler.help = ["bratbahlil <text>"]
handler.command = ["bratbahlil", "bratlil"] // kasih koma
handler.tags = ["Main"] // array

module.exports = handler
let handler = async (m, sock) => {
  let text = m.text || ''

  // Ambil kode invite dari link
  let code = text.match(/chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/)?.[1]
  if(!code) return m.reply('Kirim link grupnya bang\nContoh:.join https://chat.whatsapp.com/xxxx')

  try {
    // Cek info grup dulu biar tau tipe nya
    let info = await sock.groupGetInviteInfo(code)
    let name = info.subject
    let req = info.requesting // true = request only, false = invite only

    if(req) {
      // Tipe request only
      await sock.groupRequestJoin(code)
      m.reply(`✅ Request join ke grup *${name}* udah dikirim\nTinggal nunggu admin approve`)
    } else {
      // Tipe invite only, langsung masuk
      await sock.groupAcceptInvite(code)
      m.reply(`✅ Berhasil masuk ke grup *${name}*`)
    }
  } catch(e) {
    console.log(e)

    if(e.message.includes('already')) {
      m.reply('Bot udah ada di grup itu bang')
    } else if(e.message.includes('request')) {
      m.reply('Link nya request only. Udah gue request join, tunggu admin approve ya')
    } else {
      m.reply(`Gagal join: ${e.message}`)
    }
  }
}

handler.command = ['join', 'gabung']
handler.owner = true // biar gak disalah gunain orang
module.exports = handler

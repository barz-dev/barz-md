let handler = async (m, sock) => {
  if(!m.fromMe &&!global.owner.includes(m.sender)) return m.reply('Khusus owner bang')

  let code = m.text.match(/chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/)?.[1]
  if(!code) return m.reply(`Contoh: ${global.prefix}join https://chat.whatsapp.com/xxxx`)

  try {
    // badzz88 pake groupInviteInfo
    let info = await sock.groupInviteInfo(code).catch(()=>null)
    if(!info) throw new Error('Link invalid/expired')

    let name = info.subject
    let isRequest = info.join_approval_mode === 'on' || info.requesting

    if(isRequest) {
      await sock.groupRequestJoin(code)
      m.reply(`✅ Request join ke *${name}* udah dikirim. Tunggu admin approve`)
    } else {
      await sock.groupAcceptInvite(code)
      m.reply(`✅ Berhasil masuk ke *${name}*`)
    }
  } catch(e) {
    console.log(e)
    if(String(e).includes('already')) m.reply('Bot udah di grup itu bang')
    else m.reply('Gagal join: ' + e.message)
  }
}

handler.help = ['join <link>']
handler.tags = ['owner']
handler.command = /^join$/i
module.exports = handler

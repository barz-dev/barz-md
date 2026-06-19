let handler = async (m, sock) => {
  let text = m.text || ''
  let code = text.match(/chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/)?.[1]
  if(!code) return m.reply('Kirim link grupnya bang\nContoh:.join https://chat.whatsapp.com/xxxx')

  try {
    // Ambil info grup pake query manual biar aman semua versi
    let res = await sock.query({
      tag: 'iq',
      attrs: {
        type: 'get',
        xmlns: 'w:g2',
        to: '@s.whatsapp.net'
      },
      content: [{ tag: 'invite', attrs: { code } }]
    })

    let group = res.content[0]
    let name = group.attrs.subject
    let isRequest = group.attrs.join_approval_mode === 'on' // true = request only

    if(isRequest) {
      // Request only
      await sock.groupRequestJoin(code)
      m.reply(`✅ Request join ke grup *${name}* udah dikirim\nTinggal nunggu admin approve`)
    } else {
      // Invite only, langsung masuk
      await sock.groupAcceptInvite(code)
      m.reply(`✅ Berhasil masuk ke grup *${name}*`)
    }
  } catch(e) {
    console.log(e)

    if(e.message.includes('already')) {
      m.reply('Bot udah ada di grup itu bang')
    } else if(e.message.includes('not-authorized')) {
      // Fallback kalo query gagal, langsung coba join aja
      try {
        await sock.groupAcceptInvite(code)
        m.reply('✅ Berhasil masuk grup')
      } catch(err) {
        m.reply('Gagal join bang. Link expired/revoked, atau grupnya request only')
      }
    } else {
      m.reply(`Gagal join: ${e.message}`)
    }
  }
}

handler.command = ['join', 'gabung']
handler.owner = true
module.exports = handler

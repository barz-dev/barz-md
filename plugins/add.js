let handler = async (m, sock) => {
  if(!m.isGroup) return m.reply('Cuma bisa di grup bang')

  // Cek admin/owner yg command
  let meta = await sock.groupMetadata(m.chat)
  let user = meta.participants.find(p => p.id === m.sender)
  let isAdmin = user?.admin
  let isOwner = m.fromMe || global.owner.includes(m.sender)
  if(!isAdmin &&!isOwner) return m.reply('Khusus admin/owner')

  // Cek bot admin
  let botId = sock.user.id.split(':')[0] + '@s.whatsapp.net'
  let bot = meta.participants.find(p => p.id === botId)
  if(!bot?.admin) return m.reply('Bot harus jadi admin dulu')

  let nomor = m.text.split(' ')[1]?.replace(/[^0-9]/g, '')
  if(!nomor) return m.reply(`Contoh: ${global.prefix}add 628xxx`)
  let jid = nomor + '@s.whatsapp.net'

  // Cek udah member
  if(meta.participants.some(p => p.id === jid)) return m.reply('Udah ada di grup bang')

  // Cek daftar WA
  let [cek] = await sock.onWhatsApp(jid)
  if(!cek?.exists) return m.reply('Nomor gak daftar WA')

  try {
    await sock.groupParticipantsUpdate(m.chat, [jid], 'add')
    m.reply(`✅ Sukses add @${nomor}`, { mentions: [jid] })
  } catch(e) {
    console.log(e)
    if(String(e).includes('403')) m.reply('Gagal bang, nomor private/kena limit WA')
    else m.reply('Gagal: ' + e.message)
  }
}

handler.help = ['add <nomor>']
handler.tags = ['group']
handler.command = ['add', 'tambah']
handler.group = true
module.exports = handler

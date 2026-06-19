let handler = async (m, { conn, args, isAdmin, isOwner }) => {
    if (!m.isGroup) return m.reply('Fitur ini khusus grup!')
    if (!isAdmin &&!isOwner) return m.reply('Cuma admin/owner yg bisa add!')

    if (!args[0]) return m.reply('Format:.add 628xxx')

    let number = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    let groupMetadata = await conn.groupMetadata(m.chat)
    let participants = groupMetadata.participants.map(v => v.id)

    // Cek bot admin
    let botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net'
    let botIsAdmin = groupMetadata.participants.find(v => v.id == botNumber)?.admin
    if (!botIsAdmin) return m.reply('Bot harus jadi admin dulu!')

    // Cek udah di grup
    if (participants.includes(number)) return m.reply('Orang itu udah di grup!')

    // Cek nomor terdaftar WA
    let [result] = await conn.onWhatsApp(number)
    if (!result?.exists) return m.reply('Nomor gak terdaftar WhatsApp!')

    try {
        await conn.groupParticipantsUpdate(m.chat, [number], 'add')
        m.reply(`✅ Berhasil add @${number.split('@')[0]}`, null, { mentions: [number] })
    } catch (e) {
        m.reply('Gagal add. Mungkin nomor private / baru ganti nomor')
    }
}
handler.command = ['add', 'invite']
handler.group = true
handler.admin = true

module.exports = handler

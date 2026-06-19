let handler = async (m, { sock, args, isAdmin, isOwner }) => {
    // 1. Cek grup
    if (!m.isGroup) return sock.sendMessage(m.chat, { text: '❌ Khusus grup!' })

    // 2. Cek admin
    if (!isAdmin &&!isOwner) return sock.sendMessage(m.chat, { text: '❌ Cuma admin/owner!' })

    // 3. Cek nomor
    if (!args[0]) return sock.sendMessage(m.chat, { text: '❌ Format:.add 62851xxx' })

    let number = args[0].replace(/[^0-9]/g, '')
    if (number.length < 10) return sock.sendMessage(m.chat, { text: '❌ Nomor kependekan!' })

    let jid = number + '@s.whatsapp.net'

    try {
        // 4. Ambil data grup
        let groupMetadata = await sock.groupMetadata(m.chat)
        let participants = groupMetadata.participants.map(v => v.id)

        // 5. Cek bot admin
        let botJid = sock.user.id
        let botAdmin = groupMetadata.participants.find(p => p.id == botJid)?.admin
        if (!botAdmin) return sock.sendMessage(m.chat, { text: '❌ Bot belum jadi admin!' })

        // 6. Cek udah di grup
        if (participants.includes(jid)) return sock.sendMessage(m.chat, { text: '❌ Orang itu udah di grup!' })

        // 7. Cek nomor WA aktif
        let [cek] = await sock.onWhatsApp(jid)
        if (!cek?.exists) return sock.sendMessage(m.chat, { text: '❌ Nomor gak daftar WA!' })

        // 8. Eksekusi add
        await sock.groupParticipantsUpdate(m.chat, [jid], 'add')
        await sock.sendMessage(m.chat, {
            text: `✅ Berhasil add @${number}`,
            mentions: [jid]
        })

    } catch (e) {
        // 9. Kalo error, kasih tau errornya apa
        console.log('ERROR ADD:', e)
        await sock.sendMessage(m.chat, {
            text: `☢️ Error!\n${e.message}\n\nPenyebab umum:\n1. Nomor privasi\n2. Baru ganti nomor\n3. Kena limit add`
        })
    }
}

handler.command = ['add', 'tambah']
handler.group = true
handler.admin = true
module.exports = handler

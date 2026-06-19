let handler = async (m, { sock, args, isOwner }) => {
    // 1. Owner only
    if (!isOwner) return sock.sendMessage(m.chat, { text: '❌ Owner only!' })

    // 2. Cek link
    if (!args[0]) return sock.sendMessage(m.chat, { text: '❌ Format:.join https://chat.whatsapp.com/xxx' })

    let link = args[0]
    let code = link.match(/chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/)?.[1]
    if (!code) return sock.sendMessage(m.chat, { text: '❌ Link invite salah!' })

    try {
        // 3. Kasih feedback biar gak diem
        await sock.sendMessage(m.chat, { text: '⏳ Lagi nyoba join... tunggu 5 detik' })

        // 4. Join grup
        let res = await sock.groupAcceptInvite(code)

        // 5. Ambil info grup
        let meta = await sock.groupMetadata(res)

        await sock.sendMessage(m.chat, {
            text: `✅ Berhasil join!\n\n📛 Nama: ${meta.subject}\n👥 Member: ${meta.participants.length}\n🆔 ID: ${res}`
        })

    } catch (e) {
        console.log('ERROR JOIN:', e.message)

        let pesan = '☢️ Gagal join!\n'
        if (e.message.includes('conflict')) pesan += 'Bot udah ada di grup itu'
        else if (e.message.includes('not-authorized')) pesan += 'Butuh approval admin grup dulu'
        else if (e.message.includes('invite')) pesan += 'Link expired / invalid'
        else pesan += e.message

        await sock.sendMessage(m.chat, { text: pesan })
    }
}

handler.command = ['join', 'masuk']
handler.owner = true
handler.private = true
module.exports = handler

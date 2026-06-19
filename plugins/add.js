let handler = async (m, { sock, text }) => {
  if (!m.isOwner && !m.isAdmin) {
    return m.reply("Khusus admin!")
  }

  let number = ""

  if (m.mentionedJid?.[0]) {
    number = m.mentionedJid[0].split("@")[0]

  } else if (m.quoted?.sender) {
    number = m.quoted.sender.split("@")[0]

  } else if (text) {
    number = text.replace(/[^\d]/g, "")
  }

  if (!number || number.length < 7) {
    return m.reply(
      `*Example:*\n${global.prefix}add 628123456789`
    )
  }

  const jid = number + "@s.whatsapp.net"

  try {
    // cek nomor wa
    const check = await sock.onWhatsApp(number)

    if (!check || !check.length) {
      return m.reply("Nomor tidak terdaftar di WhatsApp!")
    }

    // cek member grup
    const meta = await sock.groupMetadata(m.chat)

    const already = meta.participants.find(
      v => v.id === jid
    )

    if (already) {
      return m.reply("User sudah ada di grup!")
    }

    // coba add langsung
    const res = await sock.groupParticipantsUpdate(
      m.chat,
      [jid],
      "add"
    )

    const status = String(res?.[0]?.status || "")

    if (status === "200") {
      return sock.sendMessage(
        m.chat,
        {
          text: `✅ Berhasil menambahkan @${number}`,
          mentions: [jid]
        },
        { quoted: m.verifiedQuoted }
      )
    }

    // fallback kirim invite
    try {
      const code = await sock.groupInviteCode(m.chat)

      await sock.groupParticipantsUpdate(
        m.chat,
        [jid],
        "invite"
      ).catch(() => {})

      return sock.sendMessage(
        m.chat,
        {
          text:
`⚠️ Tidak bisa add langsung.

Kemungkinan privasi target membatasi penambahan grup.

Link undangan:
https://chat.whatsapp.com/${code}`
        },
        { quoted: m.verifiedQuoted }
      )

    } catch {}

    return m.reply("Gagal menambahkan anggota.")

  } catch (e) {
    console.error("ADD ERROR:", e)
    m.reply("Terjadi kesalahan saat menambahkan anggota.")
  }
}

handler.command = ["add"]
handler.tags = ["group"]
handler.help = ["add @user / nomor"]

handler.group = true
handler.botAdmin = true

module.exports = handler

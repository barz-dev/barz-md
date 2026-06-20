let handler = async (m, { sock, text }) => {
  function formatDate(timestamp) {
    if (!timestamp) return "—"

    const d = new Date(
      typeof timestamp === "number" && timestamp < 1e12
        ? timestamp * 1000
        : timestamp
    )

    const pad = n => String(n).padStart(2, "0")

    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
  }

  function formatSubs(count) {
    if (!count || count === 0) return "0"

    if (count >= 1000000) {
      return (count / 1000000)
        .toFixed(1)
        .replace(/\.0$/, "") + "M"
    }

    if (count >= 1000) {
      return (count / 1000)
        .toFixed(1)
        .replace(/\.0$/, "") + "K"
    }

    return String(count)
  }

  if (!text) {
    return m.reply(
`📢 *CEK INFO CHANNEL*

Contoh:
${global.prefix}cekidch https://whatsapp.com/channel/xxxxxxxx`
    )
  }

  if (!text.includes("https://whatsapp.com/channel/")) {
    return m.reply("❌ Link channel tidak valid!")
  }

  try {
    if (m.react) await m.react("🕕")

    const metadata = await sock.cekIDSaluran(text)

    if (!metadata?.id) {
      if (m.react) await m.react("❌")
      return m.reply("❌ Channel tidak ditemukan!")
    }

    const chName =
      metadata.name ||
      "Unknown Channel"

    const chId =
      metadata.id ||
      "-"

    const chSubs =
      metadata.subscribers ??
      metadata.subscribers_count ??
      0

    const chDesc =
      metadata.description ||
      "Tidak ada deskripsi"

    const chVerified =
      metadata.verification === "VERIFIED"

    const chCreated =
      formatDate(metadata.creation_time)

    const chPic =
      metadata.preview === "https://mmg.whatsapp.net"
        ? global.thumbnail
        : metadata.preview

    const descPreview =
      chDesc.length > 180
        ? chDesc.slice(0, 180) + "..."
        : chDesc

    const infoText =
`╭━━━〔 📢 CHANNEL PROFILE 〕━━━⬣

👤 *${chName}*
${chVerified ? "✅ Official Verified Channel" : "⚪ Community Channel"}

╭─〔 📊 Statistik Channel 〕
│ 👥 Followers : ${formatSubs(chSubs)}
│ 🆔 ID Channel :
│ ${chId}
│
│ 📅 Dibuat :
│ ${chCreated}
╰────────────⬣

╭─〔 📝 Deskripsi 〕
│ ${descPreview}
╰────────────⬣

╭─〔 ⚡ Informasi 〕
│ 📢 WhatsApp Channel
│ 📋 ID Bisa Disalin
│ 🔗 Link Aktif
│ 🚀 Real Time Metadata
╰────────────⬣

Powered By ${global.botname}`

    const buttons = [
      {
        name: "cta_copy",
        buttonParamsJson: JSON.stringify({
          display_text: "📋 Salin ID Channel",
          copy_code: chId
        })
      },
      {
        name: "cta_url",
        buttonParamsJson: JSON.stringify({
          display_text: "📢 Buka Channel",
          url: text,
          merchant_url: text
        })
      },
      {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
          display_text: "🔍 Refresh",
          id: `.cekidch ${text}`
        })
      }
    ]

    await sock.sendButton(
      m.chat,
      chPic,
      infoText,
      m,
      {
        footer:
          `👥 ${formatSubs(chSubs)} Followers • ${global.botname}`,
        buttons
      }
    )

    if (m.react) await m.react("✅")

  } catch (e) {
    console.error("[CEKIDCH]", e)

    if (m.react) await m.react("❌")

    m.reply(
`❌ Gagal mengambil informasi channel

Kemungkinan:
• Link salah
• Channel tidak ditemukan
• Channel privat
• Method cekIDSaluran tidak tersedia

Detail:
${e.message || e}`
    )
  }
}

handler.command = [
  "cekidch",
  "cekch",
  "idch",
  "channelid",
  "infoch",
  "channelinfo"
]

handler.tags = ["tools"]
handler.help = ["cekidch <link channel>"]

module.exports = handler

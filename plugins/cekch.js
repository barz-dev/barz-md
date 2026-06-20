const axios = require("axios")

let handler = async (m, { sock, text }) => {
  if (!text) {
    return m.reply(
      `*Contoh:*\n${m.cmd} https://whatsapp.com/channel/xxxxxxxx`
    )
  }

  if (!/whatsapp\.com\/channel\//i.test(text)) {
    return m.reply("Link channel tidak valid.")
  }

  try {
    await m.react("⏳")

    const result = await sock.newsletterFromUrl(text)

    const newsletterId =
      result?.id ||
      result?.jid ||
      result?.newsletterJid ||
      result

    if (!newsletterId) {
      return m.reply("Gagal mendapatkan ID channel.")
    }

    const meta = await sock.newsletterMetadata(newsletterId)

    let adminCount = 0
    try {
      adminCount = await sock.newsletterAdminCount(newsletterId)
    } catch {}

    const name =
      meta?.name ||
      meta?.thread_metadata?.name ||
      meta?.title ||
      "Unknown"

    const description =
      meta?.description ||
      meta?.thread_metadata?.description ||
      "-"

    const subscribers =
      meta?.subscribers ||
      meta?.subscribers_count ||
      meta?.thread_metadata?.subscribers_count ||
      0

    const verified =
      meta?.verification === "VERIFIED" ||
      meta?.verified === true
        ? "✅ Verified"
        : "❌ Unverified"

    const picture =
      meta?.preview ||
      meta?.picture ||
      meta?.profile_picture ||
      global.thumbnail

    const info = `
╭━━━〔 📢 CHANNEL INFO 〕━━⬣

🏷 Nama
${name}

🆔 Newsletter ID
${newsletterId}

👥 Followers
${subscribers}

👮 Admin
${adminCount || 0}

✔ Status
${verified}

📝 Deskripsi
${description}

╰━━━━━━━━━━━━━━━━⬣
`

    const buttons = [
      {
        name: "cta_copy",
        buttonParamsJson: JSON.stringify({
          display_text: "📋 Copy ID",
          copy_code: newsletterId
        })
      },
      {
        name: "cta_url",
        buttonParamsJson: JSON.stringify({
          display_text: "🔗 Buka Channel",
          url: text,
          merchant_url: text
        })
      }
    ]

    if (sock.sendButton) {
      await sock.sendButton(
        m.chat,
        picture,
        info,
        m,
        {
          buttons,
          footer: global.botname
        }
      )
    } else {
      await sock.sendMessage(
        m.chat,
        {
          image: { url: picture },
          caption: info
        },
        { quoted: m }
      )
    }

    await m.react("✅")

  } catch (e) {
    console.error(e)

    m.reply(
      "Error:\n\n" +
      e.message +
      "\n\n" +
      "Kemungkinan struktur metadata berbeda pada fork baileys yang kamu pakai."
    )
  }
}

handler.command = ["cekch", "cekidch", "infoch"]
handler.help = ["cekch <link channel>"]
handler.tags = ["tools"]

module.exports = handler

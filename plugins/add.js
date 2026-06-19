let handler = async (m, { sock, text }) => {
  if (!m.isOwner && !m.isAdmin) {
    return m.reply("Khusus admin!")
  }

  let args = text ? text.trim().split(/\s+/) : []

  if (!args.length) {
    return m.reply(
`👥 *ADD MEMBER*

Contoh:
${global.prefix}add 628123456789
`
    )
  }

  let numbers = []

  if (m.mentionedJid?.length) {
    numbers.push(
      ...m.mentionedJid.map(v => v.split("@")[0])
    )
  }

  for (let arg of args) {
    let num = arg.replace(/[^\d]/g, "")

    if (num.length >= 7) {
      numbers.push(num)
    }
  }

  numbers = [...new Set(numbers)]

  if (!numbers.length) {
    return m.reply("Nomor tidak valid!")
  }

  try {
    const meta = await sock.groupMetadata(m.chat)

    let success = []
    let invited = []
    let failed = []
    let exists = []

    for (const number of numbers) {
      const jid = number + "@s.whatsapp.net"

      try {
        const check = await sock.onWhatsApp(number)

        if (!check || !check.length) {
          failed.push({
            num: number,
            reason: "Tidak terdaftar"
          })
          continue
        }

        const already = meta.participants.find(
          v =>
            v.id === jid ||
            v.jid === jid
        )

        if (already) {
          exists.push(number)
          continue
        }

        const res = await sock.groupParticipantsUpdate(
          m.chat,
          [jid],
          "add"
        )

        const status = String(
          res?.[0]?.status || ""
        )

        if (status === "200") {
          success.push(number)
        } else if (
          status === "403" ||
          status === "408" ||
          status === "409"
        ) {
          invited.push(number)
        } else {
          failed.push({
            num: number,
            reason: status || "Unknown"
          })
        }

      } catch (e) {
        failed.push({
          num: number,
          reason: e?.message || "Error"
        })
      }
    }

    let result =
      `👥 @${m.sender.split("@")[0]} menambahkan member\n\n`

    if (success.length) {
      result +=
`✅ *Berhasil Ditambahkan (${success.length})*
${success.map(v => `• @${v}`).join("\n")}

`
    }

    if (invited.length) {
      result +=
`📨 *Diundang (${invited.length})*
${invited.map(v => `• @${v}`).join("\n")}

`
    }

    if (exists.length) {
      result +=
`⏭️ *Sudah Di Grup (${exists.length})*
${exists.map(v => `• @${v}`).join("\n")}

`
    }

    if (failed.length) {
      result +=
`❌ *Gagal (${failed.length})*
${failed.map(v => `• @${v.num} (${v.reason})`).join("\n")}`
    }

    let mentions = [
      ...success.map(v => v + "@s.whatsapp.net"),
      ...invited.map(v => v + "@s.whatsapp.net"),
      ...exists.map(v => v + "@s.whatsapp.net"),
      ...failed.map(v => v.num + "@s.whatsapp.net"),
      m.sender
    ]

    await sock.sendMessage(
      m.chat,
      {
        text: result,
        mentions
      },
      { quoted: m.verifiedQuoted }
    )

  } catch (e) {
    console.error("ADD ERROR:", e)

    m.reply(
      `❌ Gagal menambahkan member\n\n${e.message || e}`
    )
  }
}

handler.command = ["add"]
handler.tags = ["group"]
handler.help = ["add 628xxxx"]

handler.group = true
handler.botAdmin = true

module.exports = handler

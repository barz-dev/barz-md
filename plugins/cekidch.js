const axios = require("axios")

let prepareWAMessageMedia
try {
  prepareWAMessageMedia = require("@badzz88/baileys").prepareWAMessageMedia
} catch {}

let handler = async (m, { sock, text }) => {
  if (!text) {
    return m.reply(
      `Contoh:\n${global.prefix}cekch https://whatsapp.com/channel/xxxxxxxx`
    )
  }

  const match = text.match(
    /whatsapp\.com\/channel\/([A-Za-z0-9]+)/i
  )

  if (!match) {
    return m.reply("Link channel tidak valid!")
  }

  const inviteCode = match[1]

  try {
    const data = await sock.newsletterMetadata(
      "invite",
      inviteCode
    )

    const name =
      data.name ||
      data.thread_metadata?.name ||
      "Tidak diketahui"

    const newsletterId =
      data.id ||
      data.newsletterJid ||
      "Tidak diketahui"

    const desc =
      data.description ||
      data.thread_metadata?.description ||
      "-"

    const followers =
      data.subscribers ||
      data.subscribers_count ||
      data.followers ||
      0

    const verified =
      data.verification === "verified" ||
      data.verified === true
        ? "✅ Verified"
        : "❌ Tidak"

    const creation =
      data.creation_time
        ? new Date(
            data.creation_time * 1000
          ).toLocaleString("id-ID")
        : "-"

    let thumb = null

    try {
      const picUrl =
        data.picture?.direct_path ||
        data.picture ||
        data.preview ||
        data.profile_picture_url

      if (picUrl) {
        const res = await axios.get(picUrl, {
          responseType: "arraybuffer"
        })
        thumb = Buffer.from(res.data)
      }
    } catch {}

    const body =
`╭━━━〔 📢 CHANNEL INFO 〕━━━⬣

▢ Nama
└ ${name}

▢ Followers
└ ${followers.toLocaleString("id-ID")}

▢ Newsletter ID
└ ${newsletterId}

▢ Verified
└ ${verified}

▢ Dibuat
└ ${creation}

▢ Deskripsi
└ ${desc}

╰━━━━━━━━━━━━━━━━⬣`

    const nativeFlow = {
      buttons: [
        {
          name: "cta_copy",
          buttonParamsJson: JSON.stringify({
            display_text: "📋 Salin ID",
            copy_code: newsletterId
          })
        },
        {
          name: "cta_url",
          buttonParamsJson: JSON.stringify({
            display_text: "📢 Buka Channel",
            url: `https://whatsapp.com/channel/${inviteCode}`,
            merchant_url: `https://whatsapp.com/channel/${inviteCode}`
          })
        }
      ]
    }

    if (thumb && prepareWAMessageMedia) {
      const media = await prepareWAMessageMedia(
        { image: thumb },
        { upload: sock.waUploadToServer }
      )

      return await sock.relayMessage(
        m.chat,
        {
          viewOnceMessage: {
            message: {
              interactiveMessage: {
                header: {
                  hasMediaAttachment: true,
                  imageMessage: media.imageMessage
                },
                body: {
                  text: body
                },
                footer: {
                  text: global.botname
                },
                nativeFlowMessage: nativeFlow
              }
            }
          }
        },
        {}
      )
    }

    await sock.relayMessage(
      m.chat,
      {
        viewOnceMessage: {
          message: {
            interactiveMessage: {
              body: {
                text: body
              },
              footer: {
                text: global.botname
              },
              nativeFlowMessage: nativeFlow
            }
          }
        }
      },
      {}
    )

  } catch (e) {
    console.error(e)

    m.reply(
`❌ Gagal mengambil data channel

Kemungkinan:
• Link tidak valid
• Channel privat
• Fork baileys tidak support newsletterMetadata()`
    )
  }
}

handler.command = ["cekch", "cekidch"]
handler.tags = ["tools"]
handler.help = ["cekch <link channel>"]

module.exports = handler

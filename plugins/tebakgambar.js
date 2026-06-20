const axios = require('axios')

let timeout = 60000
let poin = 100

let handler = async (m, { sock, command }) => {
  this.tebakgambar = this.tebakgambar || {}
  let id = m.chat

  // COMMAND NYERAH
  if (command === 'nyerah' || command === 'skip') {
    if (!(id in this.tebakgambar)) return m.reply('Gak ada soal aktif bang')

    let [sentMsg, jawaban, poin, timer] = this.tebakgambar[id]
    clearTimeout(timer)
    await sock.sendMessage(m.chat, {
      text: `Yaudah nyerah 😮‍💨\nJawaban: *${jawaban}*`
    }, { quoted: sentMsg })
    delete this.tebakgambar[id]
    return
  }

  // COMMAND TEBAKGAMBAR
  if (id in this.tebakgambar)
    return m.reply('Masih ada soal yg belum dijawab! Ketik.nyerah buat skip')

  await m.react('⏱️')

  try {
    let { data } = await axios.get('https://api.siputzx.my.id/api/games/tebakgambar')
    if (!data.status ||!data.data) return m.reply('API error bang 😭')

    let { img, jawaban, deskripsi } = data.data

    let caption = `*TEBAK GAMBAR*\n\n${deskripsi}\n\nWaktu: ${timeout/1000} detik\nPoin: ${poin}\n\nReply gambar ini buat jawab!\nKetik.nyerah buat skip`

    let sent = await sock.sendMessage(m.chat, {
      image: { url: img },
      caption
    }, { quoted: m })

    this.tebakgambar[id] = [
      sent,
      jawaban.toLowerCase().trim(),
      poin,
      setTimeout(() => {
        if (this.tebakgambar[id]) {
          sock.sendMessage(m.chat, { text: `Waktu habis!\nJawaban: *${jawaban}*` }, { quoted: sent })
          delete this.tebakgambar[id]
        }
      }, timeout)
    ]

    await m.react('✅')
  } catch (e) {
    console.log(e)
    await m.react('❌')
    m.reply('Gagal ambil soal: ' + e.message)
  }
}

handler.help = ['tebakgambar', 'nyerah']
handler.tags = ['game']
handler.command = ["tebakgambar", "nyerah", "skip"]

// Handler jawaban - reply gambar soal
handler.all = async function(m) {
  if (!m.text) return
  this.tebakgambar = this.tebakgambar || {}
  let id = m.chat
  if (!(id in this.tebakgambar)) return

  let [sentMsg, jawaban, poin, timer] = this.tebakgambar[id]
  let isReply = m.quoted?.id === sentMsg.key.id
  if (!isReply) return

  if (m.text.toLowerCase().trim() == jawaban) {
    clearTimeout(timer)
    await m.react('🎉')
    await sock.sendMessage(m.chat, {
      text: `✅ Benar! Jawaban: *${jawaban}*\n+${poin} Poin`
    }, { quoted: sentMsg })
    delete this.tebakgambar[id]
  } else {
    await m.react('❌')
    await sock.sendMessage(m.chat, {
      text: `❌ Salah! Coba lagi`
    }, { quoted: sentMsg })
  }
}

module.exports = handler

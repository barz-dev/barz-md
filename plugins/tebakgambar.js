let fetch = require('node-fetch')

let timeout = 60000 // 60 detik
let poin = 100 // koin yg didapat

let handler = async (m, { sock }) => {
  this.tebakgambar = this.tebakgambar? this.tebakgambar : {}

  let id = m.chat
  if (id in this.tebakgambar)
    return m.reply('Masih ada soal yg belum dijawab! Ketik.nyerah buat skip')

  let src = await fetch('https://api.lolhuman.xyz/api/tebakgambar?apikey=DEMO') // ganti DEMO pake apikey lu
  let json = await src.json()

  if (!json.status) return m.reply('API error bang 😭')

  let caption = `*TEBAK GAMBAR*\n\nWaktu: ${timeout/1000} detik\nPoin: ${poin}\n\nKetik jawaban di chat ini!`

  this.tebakgambar[id] = [
    await sock.sendMessage(m.chat, {
      image: { url: json.result.img },
      caption
    }, { quoted: m }),
    json.result.jawaban.toLowerCase(),
    poin,
    setTimeout(() => {
      if (this.tebakgambar[id]) {
        m.reply(`Waktu habis!\nJawaban: *${json.result.jawaban}*`)
        delete this.tebakgambar[id]
      }
    }, timeout)
  ]
}

handler.help = ['tebakgambar']
handler.tags = ['game'] // masuk kategori 𝗚𝗔𝗠𝗘 🎮
handler.command = /^tebakgambar$/i

// Handler jawaban
handler.all = async function(m) {
  if (!m.text) return
  this.tebakgambar = this.tebakgambar? this.tebakgambar : {}
  let id = m.chat
  if (!(id in this.tebakgambar)) return

  let [msg, jawaban, poin] = this.tebakgambar[id]
  if (m.text.toLowerCase() == jawaban) {
    clearTimeout(this.tebakgambar[id][3])
    m.reply(`✅ Benar! Jawaban: *${jawaban}*\n+${poin} Poin`)
    delete this.tebakgambar[id]
  }
}

module.exports = handler
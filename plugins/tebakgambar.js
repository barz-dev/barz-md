const axios = require('axios')

let timeout = 60000
let poin = 100

function similarity(s1, s2) {
  let longer = s1, shorter = s2
  if (s1.length < s2.length) [longer, shorter] = [s2, s1]
  let longerLength = longer.length
  if (longerLength == 0) return 1.0
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
}

function editDistance(s1, s2) {
  s1 = s1.toLowerCase(); s2 = s2.toLowerCase()
  let costs = Array(s2.length + 1).fill(0).map((_, i) => i)
  for (let i = 1; i <= s1.length; i++) {
    let lastValue = i
    for (let j = 1; j <= s2.length; j++) {
      let newValue = costs[j - 1]
      if (s1.charAt(i - 1)!= s2.charAt(j - 1))
        newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1
      costs[j - 1] = lastValue
      lastValue = newValue
    }
    costs[s2.length] = lastValue
  }
  return costs[s2.length]
}

async function getSoal() {
  let apis = [
    'https://api.siputzx.my.id/api/games/tebakgambar',
    'https://api.betabotz.eu.org/api/game/tebakgambar'
  ]
  for(let url of apis) {
    try {
      let { data } = await axios.get(url, { timeout: 8000 })
      if(data.status && data.data) return { img: data.data.img, jawaban: data.data.jawaban, deskripsi: data.data.deskripsi }
      if(data.status && data.result) return { img: data.result.img, jawaban: data.result.jawaban, deskripsi: data.result.deskripsi }
    } catch(e) { continue }
  }
  throw new Error('API tebakgambar down semua bang 😭')
}

let handler = async (m, { sock, command }) => {
  this.tebakgambar = this.tebakgambar || {}
  let id = m.chat

  if (command === 'nyerah' || command === 'skip') {
    if (!(id in this.tebakgambar)) return m.reply('Gak ada soal aktif bang')
    let { key, jawaban, timer } = this.tebakgambar[id]
    clearTimeout(timer)
    await sock.sendMessage(m.chat, { text: `Yaudah nyerah 😮‍💨\nJawaban: *${jawaban}*` }, { quoted: m })
    delete this.tebakgambar[id]
    return
  }

  if (id in this.tebakgambar)
    return m.reply('Masih ada soal yg belum dijawab! Ketik.nyerah buat skip')

  await m.react('⏱️')

  try {
    let { img, jawaban, deskripsi } = await getSoal()

    let caption = `*TEBAK GAMBAR*\n\n${deskripsi}\n\nWaktu: ${timeout/1000} detik\nPoin: ${poin}\n\nReply gambar ini buat jawab!\nKetik.nyerah buat skip`

    // KUNCI: Kirim URL langsung, gak pake download buffer
    let sent = await sock.sendMessage(m.chat, { image: { url: img }, caption }, { quoted: m })

    this.tebakgambar[id] = {
      key: sent.key.id,
      jawaban: jawaban.toLowerCase(),
      timer: setTimeout(() => {
        if (this.tebakgambar[id]) {
          sock.sendMessage(m.chat, { text: `Waktu habis!\nJawaban: *${jawaban}*` }, { quoted: m })
          delete this.tebakgambar[id]
        }
      }, timeout)
    }

    await m.react('✅')
  } catch (e) {
    console.log('[TEBAKGAMBAR ERROR]', e)
    await m.react('❌')
    m.reply('Gagal: ' + e.message)
  }
}

handler.help = ['tebakgambar', 'nyerah']
handler.tags = ['game']
handler.command = ["tebakgambar", "nyerah", "skip"]

handler.all = async function(m) {
  if (!m.text) return false
  this.tebakgambar = this.tebakgambar || {}
  let id = m.chat
  if (!(id in this.tebakgambar)) return false

  let { key, jawaban, timer } = this.tebakgambar[id]
  let quotedId = m.quoted?.id || m.quoted?.key?.id
  if (quotedId!= key) return false

  let userJawab = m.text.toLowerCase().trim().replace(/[^a-z0-9]/g, '')
  let realJawab = jawaban.toLowerCase().replace(/[^a-z0-9]/g, '')
  let mirip = similarity(userJawab, realJawab)
  let bedaHuruf = editDistance(userJawab, realJawab)

  try {
    if (userJawab == realJawab) {
      clearTimeout(timer)
      await m.react('🎉')
      await sock.sendMessage(m.chat, { text: `✅ Benar! Jawaban: *${jawaban}*\n+${poin} Poin` }, { quoted: m })
      delete this.tebakgambar[id]
      return true
    } else {
      await m.react('❌')
      if (bedaHuruf <= 2 || mirip >= 0.85) {
        await sock.sendMessage(m.chat, { text: `🤔 Salah tapi udah mendekati!\nJawaban lu: *${m.text}*\nBeda ${bedaHuruf} huruf doang!` }, { quoted: m })
      } else {
        await sock.sendMessage(m.chat, { text: `❌ Salah jauh banget 😭\nJawaban lu: *${m.text}*` }, { quoted: m })
      }
      return true
    }
  } catch(e) {
    await m.reply('Error: ' + e.message)
    return true
  }
}

module.exports = handler

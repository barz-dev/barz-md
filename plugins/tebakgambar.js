const axios = require('axios')

let timeout = 60000
let poin = 100

// Fungsi ngitung seberapa mirip 2 kata
function similarity(s1, s2) {
  let longer = s1, shorter = s2
  if (s1.length < s2.length) [longer, shorter] = [s2, s1]
  let longerLength = longer.length
  if (longerLength == 0) return 1.0
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
}

function editDistance(s1, s2) {
  s1 = s1.toLowerCase(); s2 = s2.toLowerCase()
  let costs = []
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i
    for (let j = 0; j <= s2.length; j++) {
      if (i == 0) costs[j] = j
      else {
        if (j > 0) {
          let newValue = costs[j - 1]
          if (s1.charAt(i - 1)!= s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1
          costs[j - 1] = lastValue
          lastValue = newValue
        }
      }
    }
    if (i > 0) costs[s2.length] = lastValue
  }
  return costs[s2.length]
}

let handler = async (m, { sock, command }) => {
  this.tebakgambar = this.tebakgambar || {}
  let id = m.chat

  if (command === 'nyerah' || command === 'skip') {
    if (!(id in this.tebakgambar)) return m.reply('Gak ada soal aktif bang')
    let [sentMsg, jawaban, poin, timer] = this.tebakgambar[id]
    clearTimeout(timer)
    await sock.sendMessage(m.chat, { text: `Yaudah nyerah 😮‍💨\nJawaban: *${jawaban}*` }, { quoted: sentMsg })
    delete this.tebakgambar[id]
    return
  }

  if (id in this.tebakgambar)
    return m.reply('Masih ada soal yg belum dijawab! Ketik.nyerah buat skip')

  await m.react('⏱️')

  try {
    let { data } = await axios.get('https://api.siputzx.my.id/api/games/tebakgambar')
    if (!data.status ||!data.data) return m.reply('API error bang 😭')

    let { img, jawaban, deskripsi } = data.data
    let imgBuffer = await axios.get(img, { responseType: 'arraybuffer', timeout: 10000 }).then(res => Buffer.from(res.data))

    let caption = `*TEBAK GAMBAR*\n\n${deskripsi}\n\nWaktu: ${timeout/1000} detik\nPoin: ${poin}\n\nReply gambar ini buat jawab!\nKetik.nyerah buat skip`

    let sent = await sock.sendMessage(m.chat, { image: imgBuffer, caption }, { quoted: m })

    this.tebakgambar[id] = [sent, jawaban.toLowerCase().trim(), poin, setTimeout(() => {
      if (this.tebakgambar[id]) {
        sock.sendMessage(m.chat, { text: `Waktu habis!\nJawaban: *${jawaban}*` }, { quoted: sent })
        delete this.tebakgambar[id]
      }
    }, timeout)]

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

  let [sentMsg, jawaban, poin, timer] = this.tebakgambar[id]
  let isReply = m.quoted?.id === sentMsg.key.id
  if (!isReply) return false

  let userJawab = m.text.toLowerCase().trim().replace(/ /g, '')
  let realJawab = jawaban.replace(/ /g, '')
  let mirip = similarity(userJawab, realJawab)

  if (userJawab == realJawab) {
    clearTimeout(timer)
    await m.react('🎉')
    await sock.sendMessage(m.chat, { text: `✅ Benar! Jawaban: *${jawaban}*\n+${poin} Poin` }, { quoted: sentMsg })
    delete this.tebakgambar[id]
    return true
  } else {
    await m.react('❌')

    // KUNCI: Kalo mirip >70% = mendekati
    if (mirip >= 0.7) {
      await sock.sendMessage(m.chat, {
        text: `🤔 Salah tapi udah mendekati!\nJawaban lu: *${m.text}*\nCoba lagi, dikit lagi!`
      }, { quoted: sentMsg })
    } else {
      await sock.sendMessage(m.chat, {
        text: `❌ Salah jauh banget 😭\nJawaban lu: *${m.text}*\nCoba pikir lagi!`
      }, { quoted: sentMsg })
    }
    return true
  }
}

module.exports = handler

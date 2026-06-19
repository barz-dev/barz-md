const fs = require('fs')
const path = './database/autoai.json'
const historyPath = './database/ai_history.json'
const axios = require('axios')

if (!fs.existsSync('./database')) fs.mkdirSync('./database', { recursive: true })
if (!fs.existsSync(path)) fs.writeFileSync(path, '{"on":false}')
if (!fs.existsSync(historyPath)) fs.writeFileSync(historyPath, '{}')

// AUTO CLEAN HISTORY TIAP 1 JAM
setInterval(() => {
  try {
    let historyDB = JSON.parse(fs.readFileSync(historyPath))
    let now = Date.now()
    let cleaned = 0

    for (let userId in historyDB) {
      // filter chat yang < 1 jam = 3600000 ms
      let newHistory = historyDB[userId].filter(chat => {
        return!chat.time || (now - chat.time) < 3600000
      })

      if (newHistory.length!== historyDB[userId].length) cleaned++
      historyDB[userId] = newHistory

      // hapus user kalo history kosong
      if (historyDB[userId].length === 0) delete historyDB[userId]
    }

    fs.writeFileSync(historyPath, JSON.stringify(historyDB))
    if (cleaned > 0) console.log(`[AUTO AI] Cleaned history ${cleaned} user > 1 jam`)
  } catch(e) {
    console.log('[AUTO AI] Clean error:', e.message)
  }
}, 3600000) // 1 jam = 3600000ms

let handler = async (m, { args, isOwner }) => {
  if (!isOwner) return m.reply('Owner only bang')

  let db = JSON.parse(fs.readFileSync(path))

  if (args[0] === 'on') {
    db.on = true
    fs.writeFileSync(path, JSON.stringify(db))
    return m.reply('✅ Done Tuan')
  }
  if (args[0] === 'off') {
    db.on = false
    fs.writeFileSync(path, JSON.stringify(db))
    return m.reply('❌ Auto AI OFF Global')
  }
  if (args[0] === 'clear') {
    fs.writeFileSync(historyPath, '{}')
    return m.reply('✅ Done Tuan')
  }
  m.reply(`Status: ${db.on? 'ON ✅' : 'OFF ❌'}\n.autoai on/off/clear`)
}
handler.command = ['autoai']
handler.owner = true
module.exports = handler

setTimeout(async () => {
  let sock = global.conn || global.sock || global.client
  if (!sock) return console.log('[AUTO AI] Gagal ambil sock')

  sock.ev.on('messages.upsert', async ({ messages }) => {
    let msg = messages[0]
    if (!msg?.message || msg.key.fromMe) return

    let db = JSON.parse(fs.readFileSync(path))
    if (!db.on) return

    let text = msg.message.conversation || msg.message.extendedTextMessage?.text || ''
    let isGroup = msg.key.remoteJid.endsWith('@g.us')
    let botId = sock.user.id.split(':')[0] + '@s.whatsapp.net'
    let userId = msg.key.participant || msg.key.remoteJid

    let trigger = false
    if (!isGroup) trigger = true
    else {
      let mention = msg.message.extendedTextMessage?.contextInfo?.mentionedJid || []
      let quoted = msg.message.extendedTextMessage?.contextInfo?.stanzaId
      if (mention.includes(botId)) trigger = true
      else if (quoted) trigger = true
      else if (/bot/i.test(text)) trigger = true
    }
    if (!trigger) return

    try {
      await sock.sendPresenceUpdate('composing', msg.key.remoteJid)
      await new Promise(r => setTimeout(r, 1500 + Math.random() * 1000))

      let historyDB = JSON.parse(fs.readFileSync(historyPath))
      if (!historyDB[userId]) historyDB[userId] = []
      let history = historyDB[userId]

      history.push({ role: 'user', content: text, time: Date.now() }) // tambah timestamp
      if (history.length > 10) history.shift()

      let jawaban = await aiLuminai(history, userId)
      history.push({ role: 'assistant', content: jawaban, time: Date.now() })
      historyDB[userId] = history
      fs.writeFileSync(historyPath, JSON.stringify(historyDB))

      await sock.sendMessage(msg.key.remoteJid, { text: jawaban }, { quoted: msg })
      console.log(`[AUTO AI] ${userId.split('@')[0]}: ${text.slice(0,25)}...`)

    } catch(e) {
      console.log('[AUTO AI] Error:', e.message)
      await sock.sendMessage(msg.key.remoteJid, { text: 'Error AI bang, coba lagi' }, { quoted: msg })
    }
  })
}, 5000)

async function aiLuminai(history, userId) {
  try {
    let res = await axios.get('https://luminai.my.id/api/gpt-4', {
      params: {
        text: history[history.length-1].content,
        history: JSON.stringify(history.slice(0, -1).map(h => ({role:h.role,content:h.content}))),
        uid: userId
      },
      timeout: 15000
    })
    return res.data.result || 'Modar'
  } catch {
    let res = await axios.get('https://api.ryzumi.vip/api/ai/gpt-4', {
      params: {
        text: history[history.length-1].content,
        history: JSON.stringify(history.slice(0, -1).map(h => ({role:h.role,content:h.content}))),
        user: userId
      },
      timeout: 15000
    })
    return res.data.result || 'Modar'
  }
}

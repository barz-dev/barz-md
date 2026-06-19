const fs = require('fs')
const path = './database/autoai.json'
const historyPath = './database/ai_history.json'
const axios = require('axios')

if (!fs.existsSync('./database')) fs.mkdirSync('./database', { recursive: true })
if (!fs.existsSync(path)) fs.writeFileSync(path, '{"on":false}')
if (!fs.existsSync(historyPath)) fs.writeFileSync(historyPath, '{}')

// Auto clean history tiap 1 jam
setInterval(() => {
  try {
    let historyDB = JSON.parse(fs.readFileSync(historyPath))
    let now = Date.now()
    let cleaned = 0
    for (let userId in historyDB) {
      let newHistory = historyDB[userId].filter(chat =>!chat.time || (now - chat.time) < 3600000)
      if (newHistory.length!== historyDB[userId].length) cleaned++
      historyDB[userId] = newHistory
      if (historyDB[userId].length === 0) delete historyDB[userId]
    }
    fs.writeFileSync(historyPath, JSON.stringify(historyDB))
    if (cleaned > 0) console.log(`[AUTO AI] Cleaned history ${cleaned} user > 1 jam`)
  } catch(e) {}
}, 3600000)

// COMMAND HANDLER
let handler = async (m, { args, isOwner }) => {
  if (!isOwner) return m.reply('Khusus Own doang')

  let db = JSON.parse(fs.readFileSync(path))

  if (args[0] === 'on') {
    db.on = true
    fs.writeFileSync(path, JSON.stringify(db))
    return m.reply('✅ Done Tuan')
  }

  if (args[0] === 'off') {
    db.on = false
    fs.writeFileSync(path, JSON.stringify(db))
    return m.reply('❌ Done Om')
  }

  if (args[0] === 'clear') {
    fs.writeFileSync(historyPath, '{}')
    return m.reply('✅ History AI dihapus Tuan')
  }

  m.reply(`Status: ${db.on? 'ON ✅' : 'OFF ❌'}\n.autoai on/off/clear`)
}
handler.command = ['autoai']
handler.owner = true

// LISTENER FUNCTION
let autoai = async (m, sock) => {
  try {
    if (!m?.message || m.key.fromMe) return

    let db = JSON.parse(fs.readFileSync(path))
    if (!db.on) return

    let text = m.message.conversation || m.message.extendedTextMessage?.text || ''
    if (!text) return

    let isGroup = m.key.remoteJid.endsWith('@g.us')
    let botId = sock.user.id.split(':')[0] + '@s.whatsapp.net'
    let userId = m.key.participant || m.key.remoteJid

    let trigger = false
    if (!isGroup) trigger = true // PC auto jawab
    else {
      let mention = m.message.extendedTextMessage?.contextInfo?.mentionedJid || []
      let quoted = m.message.extendedTextMessage?.contextInfo?.stanzaId
      if (mention.includes(botId)) trigger = true // di tag
      else if (quoted) trigger = true // di reply
      else if (/bot/i.test(text)) trigger = true // ada kata bot
    }

    if (!trigger) return

    await sock.sendPresenceUpdate('composing', m.key.remoteJid)
    await new Promise(r => setTimeout(r, 1500 + Math.random() * 1000))

    let historyDB = JSON.parse(fs.readFileSync(historyPath))
    if (!historyDB[userId]) historyDB[userId] = []
    let history = historyDB[userId]

    history.push({ role: 'user', content: text, time: Date.now() })
    if (history.length > 10) history.shift()

    let jawaban = await aiLuminai(history, userId)

    history.push({ role: 'assistant', content: jawaban, time: Date.now() })
    historyDB[userId] = history
    fs.writeFileSync(historyPath, JSON.stringify(historyDB))

    await sock.sendMessage(m.key.remoteJid, { text: jawaban }, { quoted: m })
    console.log(`[AUTO AI] ${userId.split('@')[0]}: ${text.slice(0,25)}...`)
  } catch(e) {
    console.log('[AUTO AI] Error listener:', e.message)
  }
}

// API AI BARU - UDAH FIX
async function aiLuminai(history, userId) {
  try {
    let messages = [
      {role: 'system', content: 'Kamu asisten WhatsApp yang bernama ${global.packname} . jawab dengan awalan nama dulu ${global.packname} :, lucu, pake bahasa gaul Indonesia'}
    ]

    let recent = history.slice(-8).map(h => ({role: h.role, content: h.content}))
    messages.push(...recent)

    let res = await axios.post('https://api.gptgo.ai/v1/chat/completions', {
      messages: messages,
      model: 'gpt-3.5-turbo'
    }, {
      headers: {'Content-Type': 'application/json'},
      timeout: 15000
    })

    return res.data.choices[0].message.content || 'AI lagi error bang'
  } catch(e) {
    console.log('[AUTO AI] Error API:', e.response?.data || e.message)
    return 'AI lagi down bang, coba 1 menit lagi'
  }
}

module.exports = autoai
module.exports.command = handler

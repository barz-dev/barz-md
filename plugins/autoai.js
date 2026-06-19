const fs = require('fs')
const path = './database/autoai.json'
const historyPath = './database/ai_history.json'
const axios = require('axios')

if (!fs.existsSync('./database')) fs.mkdirSync('./database', { recursive: true })
if (!fs.existsSync(path)) fs.writeFileSync(path, '{"on":false}')
if (!fs.existsSync(historyPath)) fs.writeFileSync(historyPath, '{}')

setInterval(() => {
  try {
    let historyDB = JSON.parse(fs.readFileSync(historyPath))
    let now = Date.now()
    for (let userId in historyDB) {
      historyDB[userId] = historyDB[userId].filter(chat =>!chat.time || (now - chat.time) < 3600000)
      if (historyDB[userId].length === 0) delete historyDB[userId]
    }
    fs.writeFileSync(historyPath, JSON.stringify(historyDB))
  } catch(e) {}
}, 3600000)

let autoai = async (m, sock) => {
  if (!m?.message || m.key.fromMe) return
  let db = JSON.parse(fs.readFileSync(path))
  if (!db.on) return

  let text = m.body || ''
  let isGroup = m.isGroup
  let botId = sock.user.id.split(':')[0] + '@s.whatsapp.net'
  let userId = m.sender

  let trigger = false
  if (!isGroup) trigger = true
  else {
    let mention = m.mentionedJid || []
    let quoted = m.quoted
    if (mention.includes(botId) || (quoted && quoted.sender === botId) || /bot|ai/i.test(text)) {
      trigger = true
    }
  }
  if (!trigger) return

  try {
    await sock.sendPresenceUpdate('composing', m.chat)
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 800))

    let historyDB = JSON.parse(fs.readFileSync(historyPath))
    if (!historyDB[userId]) historyDB[userId] = []
    let history = historyDB[userId]
    history.push({ role: 'user', content: text, time: Date.now() })
    if (history.length > 10) history.shift()

    let jawaban = await aiLuminai(history, userId)
    history.push({ role: 'assistant', content: jawaban, time: Date.now() })
    historyDB[userId] = history
    fs.writeFileSync(historyPath, JSON.stringify(historyDB))

    await sock.sendMessage(m.chat, { text: jawaban }, { quoted: m })
    console.log(`[AUTO AI] ${userId.split('@')[0]}: ${text.slice(0,30)}...`)
  } catch(e) {
    console.log('[AUTO AI] Error:', e.message)
  }
}

async function aiLuminai(history, userId) {
  const text = history[history.length-1].content
  const botName = global.packname || 'AI Bot'
  let prompt = `Kamu ${botName}, AI assistant ramah. Jawab singkat padat bahasa Indonesia gaul max 3 baris\n`
  history.slice(-8, -1).forEach(h => {
    prompt += `${h.role === 'user'? 'User' : botName}: ${h.content}\n`
  })
  prompt += `User: ${text}\n${botName}:`

  try {
    const url = `https://api.siputzx.my.id/api/ai/glm47flash?prompt=${encodeURIComponent(prompt)}`
    const res = await axios.get(url, { timeout: 15000 })
    if (res.data.status && res.data.response) return res.data.response.trim()
    throw new Error('Response kosong')
  } catch (e) {
    console.log('[GLM47FLASH] Error:', e.message)
    return 'AI lagi ngelag bang, coba lagi bentar 😅'
  }
}
module.exports = autoai

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
    for (let userId in historyDB) {
      historyDB[userId] = historyDB[userId].filter(chat =>!chat.time || (now - chat.time) < 3600000)
      if (historyDB[userId].length === 0) delete historyDB[userId]
    }
    fs.writeFileSync(historyPath, JSON.stringify(historyDB))
  } catch(e) {}
}, 3600000)

// Listener auto AI
let autoai = async (m, sock) => {
  if (!m?.message || m.key.fromMe) return

  let db = JSON.parse(fs.readFileSync(path))
  if (!db.on) return

  let text = m.body || ''
  let isGroup = m.isGroup
  let botId = sock.user.id.split(':')[0] + '@s.whatsapp.net'
  let userId = m.sender

  // CEK TRIGGER - UDAH FIX REPLY BOT DOANG
  let trigger = false
  if (!isGroup) {
    trigger = true // PC auto jawab
  } else {
    let mention = m.mentionedJid || []
    let quoted = m.quoted

    if (mention.includes(botId)) {
      trigger = true // di tag bot
    }
    else if (quoted && quoted.sender === botId) {
      trigger = true // reply chat dari bot doang
    }
    else if (/bot|ai/i.test(text)) {
      trigger = true // ada kata bot/ai
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
    await sock.sendMessage(m.chat, { text: 'AI lagi error bang, coba lagi' }, { quoted: m })
  }
}

// API STABIL + CEPET + PUBLIC
async function aiLuminai(history, userId) {
  const text = history[history.length-1].content
  const messages = [
    {role: 'system', content: 'Kamu AI assistant ramah bernama ${global.packname}, jawab singkat padat bahasa Indonesia gaul, max 3 baris'},
 ...history.slice(0, -1).map(h => ({role: h.role, content: h.content})),
    {role: 'user', content: text}
  ]

  // API 1: PuterJS - paling stabil
  try {
    const res = await axios.post('https://api.puter.com/v1/chat/completions', {
      model: 'gpt-4o-mini',
      messages: messages,
      max_tokens: 400
    }, {timeout: 8000})
    if (res.data.choices?.[0]?.message?.content)
      return res.data.choices[0].message.content.trim()
  } catch {}

  // API 2: OpenRouter free
  try {
    const res = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'meta-llama/llama-3.1-8b-instruct:free',
      messages: messages,
      max_tokens: 400
    }, {
      headers: {'HTTP-Referer': 'https://github.com'},
      timeout: 8000
    })
    if (res.data.choices?.[0]?.message?.content)
      return res.data.choices[0].message.content.trim()
  } catch {}

  return 'AI lagi ngelag bang 😅 coba lagi 3 detik'
}

module.exports = autoai

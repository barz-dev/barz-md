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
  try {
    if (!m?.message || m.key.fromMe) return
    let db = JSON.parse(fs.readFileSync(path))
    if (!db.on) return

    let text = m.body || m.msg?.text || m.msg?.caption || ''
    let isGroup = m.isGroup
    let botId = sock.user.id
    let botNumber = botId.split('@')[0]
    let userId = m.sender

    // Cek trigger - lebih longgar biar pasti nyantol
    let trigger = false
    if (!isGroup) trigger = true
    else {
      let mention = m.mentionedJid || []
      let quoted = m.quoted
      let botMentioned = mention.some(jid => jid && jid.includes(botNumber))
      let replyBot = quoted && quoted.sender && quoted.sender.includes(botNumber)
      let panggilNama = /bot|ai|assalam/i.test(text.toLowerCase())

      trigger = botMentioned || replyBot || panggilNama
    }

    if (!trigger) return
    console.log(`[AUTO AI] Triggered by ${userId.split('@')[0]}: ${text.slice(0,30)}`)

    await sock.sendPresenceUpdate('composing', m.chat)
    await new Promise(r => setTimeout(r, 500 + Math.random() * 500))

    let historyDB = JSON.parse(fs.readFileSync(historyPath))
    if (!historyDB[userId]) historyDB[userId] = []
    let history = historyDB[userId]
    history.push({ role: 'user', content: text, time: Date.now() })
    if (history.length > 10) history.shift()

    let jawaban = await aiGroq(history, userId)
    if (!jawaban) {
      console.log('[AUTO AI] Groq return null')
      return
    }

    history.push({ role: 'assistant', content: jawaban, time: Date.now() })
    historyDB[userId] = history
    fs.writeFileSync(historyPath, JSON.stringify(historyDB))

    await sock.sendMessage(m.chat, { text: jawaban }, { quoted: m })
    console.log(`[AUTO AI] Sent: ${jawaban.slice(0,30)}...`)
  } catch(e) {
    console.log('[AUTO AI] Fatal Error:', e.message)
  }
}

async function aiGroq(history, userId) {
  const text = history[history.length-1].content
  const botName = global.packname || 'AI Bot'
  const GROQ_KEY = global.groqApiKey

  let defaultReplies = [
    'Lagi mikir dulu bang 😅',
    'Hmm otak gue nge-lag dikit',
    'Bentar bang, loading 99%',
    'Gue paham, tapi jawabannya ketelen wkwk'
  ]

  if (!GROQ_KEY) {
    console.log('[AUTO AI] groqApiKey kosong')
    return defaultReplies[Math.floor(Math.random() * defaultReplies.length)]
  }

  let messages = [
    {role: 'system', content: `Kamu ${botName}, AI assistant ramah. Jawab singkat padat bahasa Indonesia gaul max 3 baris`}
  ]

  history.slice(-8, -1).forEach(h => {
    messages.push({role: h.role, content: h.content})
  })
  messages.push({role: 'user', content: text})

  try {
    const res = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: 'llama-3.1-70b-versatile',
      messages: messages,
      max_tokens: 250,
      temperature: 0.8
    }, {
      timeout: 15000,
      headers: {
        'Authorization': `Bearer ${GROQ_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    return res.data.choices[0].message.content.trim()
  } catch (e) {
    console.log('[AUTO AI] Groq Error:', e.response?.status || e.code)
    return defaultReplies[Math.floor(Math.random() * defaultReplies.length)]
  }
}

module.exports = autoai

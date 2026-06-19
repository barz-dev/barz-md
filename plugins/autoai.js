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
  let botId = sock.user.id // langsung pake, gausah split + decode
  let userId = m.sender

  let trigger = false
  if (!isGroup) trigger = true
  else {
    let mention = m.mentionedJid || []
    let quoted = m.quoted
    // pake.some biar aman, gak usah jidDecode
    let botMentioned = mention.some(jid => jid === botId || jid?.split('@')[0] === botId?.split('@')[0])
    let replyBot = quoted && quoted.sender === botId
    if (botMentioned || replyBot || /bot|ai/i.test(text)) {
      trigger = true
    }
  }
  if (!trigger) return

  try {
    await sock.sendPresenceUpdate('composing', m.chat)
    await new Promise(r => setTimeout(r, 800 + Math.random() * 700))

    let historyDB = JSON.parse(fs.readFileSync(historyPath))
    if (!historyDB[userId]) historyDB[userId] = []
    let history = historyDB[userId]
    history.push({ role: 'user', content: text, time: Date.now() })
    if (history.length > 10) history.shift()

    let jawaban = await aiGroq(history, userId)
    history.push({ role: 'assistant', content: jawaban, time: Date.now() })
    historyDB[userId] = history
    fs.writeFileSync(historyPath, JSON.stringify(historyDB))

    await sock.sendMessage(m.chat, { text: jawaban }, { quoted: m })
  } catch(e) {
    // error diem aja
  }
}

async function aiGroq(history, userId) {
  const text = history[history.length-1].content
  const botName = global.packname || 'AI Bot'
  const GROQ_KEY = global.groqApiKey

  let defaultReplies = [
    'Lagi mikir dulu bang, ntar gue bales 😅',
    'Hmm menarik... tapi otak gue nge-lag dikit',
    'Gue paham maksud lu, tapi lagi blank nih wkwk',
    'Bentar bang, lagi loading... *loading 99%*',
    'Udah gue cerna, tapi jawabannya ketelen wkwk'
  ]

  if (!GROQ_KEY) return defaultReplies[Math.floor(Math.random() * defaultReplies.length)]

  let messages = [
    {role: 'system', content: `Kamu ${botName}, AI assistant ramah, lucu, asik, suka tante Tante. Jawab singkat padat bahasa Indonesia gaul max 3 baris`}
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
    return defaultReplies[Math.floor(Math.random() * defaultReplies.length)]
  }
}

module.exports = autoai

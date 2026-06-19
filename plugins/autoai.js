const fs = require('fs')
const path = './database/autoai.json'
const axios = require('axios')

console.log('=====================')
console.log('[AUTO AI] PLUGIN LOADED')
console.log('global.groqApiKey ada:',!!global.groqApiKey)
console.log('=====================')

if (!fs.existsSync('./database')) fs.mkdirSync('./database', { recursive: true })
if (!fs.existsSync(path)) fs.writeFileSync(path, '{"on":true}')

let autoai = async (m, sock) => {
  console.log('[AUTO AI] 1. Ada chat masuk dari:', m?.sender?.split('@')[0])

  try {
    if (!m?.message) return console.log('[AUTO AI] 2. Gagal: no message')
    if (m.key.fromMe) return console.log('[AUTO AI] 2. Gagal: dari bot sendiri')

    let db = JSON.parse(fs.readFileSync(path))
    console.log('[AUTO AI] 3. Status ON:', db.on)
    if (!db.on) return

    let text = m.body || m.msg?.text || m.msg?.caption || m.message?.conversation || ''
    console.log('[AUTO AI] 4. Text:', text.slice(0,50))

    // BARBAR: semua chat dibales. Nanti kalo udah jalan baru kita filter
    console.log('[AUTO AI] 5. Lolos, kirim ke Groq...')

    await sock.sendPresenceUpdate('composing', m.chat)

    const res = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: 'llama-3.1-70b-versatile',
      messages: [
        {role: 'system', content: 'Kamu AI ramah. Jawab 1 baris bahasa Indonesia gaul'},
        {role: 'user', content: text}
      ],
      max_tokens: 100,
      temperature: 0.8
    }, {
      timeout: 15000,
      headers: {
        'Authorization': `Bearer ${global.groqApiKey}`,
        'Content-Type': 'application/json'
      }
    })

    let jawaban = res.data.choices[0].message.content.trim()
    console.log('[AUTO AI] 6. Dapat jawaban:', jawaban)

    await sock.sendMessage(m.chat, { text: jawaban }, { quoted: m })
    console.log('[AUTO AI] 7. TERKIRIM KE WA!')

  } catch(e) {
    console.log('[AUTO AI] ERROR:', e.response?.status || e.code, e.message)
  }
}

module.exports = autoai

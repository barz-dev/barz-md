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
  // PERBAIKAN: Cek m terlebih dahulu
  if (!m) {
    console.log('[AUTO AI] 1. Error: m undefined')
    return
  }

  // PERBAIKAN: Gunakan optional chaining dengan aman
  const sender = m?.sender || m?.key?.remoteJid || 'unknown'
  console.log('[AUTO AI] 1. Ada chat masuk dari:', sender.split('@')[0] || sender)

  try {
    if (!m?.message) {
      console.log('[AUTO AI] 2. Gagal: no message')
      return
    }
    
    if (m.key.fromMe) {
      console.log('[AUTO AI] 2. Gagal: dari bot sendiri')
      return
    }

    let db = JSON.parse(fs.readFileSync(path))
    console.log('[AUTO AI] 3. Status ON:', db.on)
    if (!db.on) return

    // PERBAIKAN: Ambil text dengan lebih aman
    let text = m.body || 
               m.msg?.text || 
               m.msg?.caption || 
               m.message?.conversation || 
               m.message?.extendedTextMessage?.text || 
               ''
               
    if (!text || text.trim() === '') {
      console.log('[AUTO AI] 4. Text kosong, skip')
      return
    }
    
    console.log('[AUTO AI] 4. Text:', text.slice(0,50))

    console.log('[AUTO AI] 5. Lolos, kirim ke Groq...')

    await sock.sendPresenceUpdate('composing', m.chat || m.key.remoteJid)

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

    await sock.sendMessage(m.chat || m.key.remoteJid, { text: jawaban }, { quoted: m })
    console.log('[AUTO AI] 7. TERKIRIM KE WA!')

  } catch(e) {
    console.log('[AUTO AI] ERROR:', e.response?.status || e.code, e.message)
    if (e.response?.data) {
      console.log('[AUTO AI] Detail:', JSON.stringify(e.response.data).slice(0,200))
    }
  }
}

module.exports = autoai

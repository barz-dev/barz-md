const fs = require('fs')
const path = require('path')
const axios = require('axios')

// ─── CONFIG ───────────────────────────────────────
const DB_PATH = './database/autoai.json'
const GROQ_API = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.1-70b-versatile'

// Ambil API key dari berbagai sumber
const getApiKey = () => {
  const key = global.groqApiKey || process.env.GROQ_API_KEY || null
  if (!key) console.log('[AUTO AI] ⚠️ API KEY KOSONG! Set global.groqApiKey atau GROQ_API_KEY')
  return key
}

// ─── INIT DATABASE ────────────────────────────────
const initDB = () => {
  try {
    if (!fs.existsSync('./database')) {
      fs.mkdirSync('./database', { recursive: true })
      console.log('[AUTO AI] 📁 Folder database dibuat')
    }
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify({ on: true, blacklist: [] }, null, 2))
      console.log('[AUTO AI] 📝 Database baru dibuat')
    }
  } catch (e) {
    console.log('[AUTO AI] ❌ Gagal init DB:', e.message)
  }
}

initDB()

// ─── SAFE READ DB ─────────────────────────────────
const readDB = () => {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8')
    return JSON.parse(raw)
  } catch (e) {
    console.log('[AUTO AI] ⚠️ DB corrupt, reset...')
    const fresh = { on: true, blacklist: [] }
    fs.writeFileSync(DB_PATH, JSON.stringify(fresh, null, 2))
    return fresh
  }
}

// ─── EXTRACT TEXT ───────────────────────────────────
const getMessageText = (m) => {
  if (!m?.message) return ''
  
  const msg = m.message
  
  // Extended text (biasanya dari HP)
  if (msg.extendedTextMessage?.text) return msg.extendedTextMessage.text
  
  // Conversation (biasanya dari WA Web)
  if (msg.conversation) return msg.conversation
  
  // Image/video caption
  if (msg.imageMessage?.caption) return msg.imageMessage.caption
  if (msg.videoMessage?.caption) return msg.videoMessage.caption
  
  // Button response
  if (msg.buttonsResponseMessage?.selectedButtonId) return msg.buttonsResponseMessage.selectedButtonId
  if (msg.templateButtonReplyMessage?.selectedId) return msg.templateButtonReplyMessage.selectedId
  
  // List response
  if (msg.listResponseMessage?.title) return msg.listResponseMessage.title
  
  // Document
  if (msg.documentMessage?.caption) return msg.documentMessage.caption
  
  // Live location
  if (msg.liveLocationMessage) return '[Live Location]'
  
  return ''
}

// ─── DELAY HELPER ─────────────────────────────────
const delay = (ms) => new Promise(r => setTimeout(r, ms))

// ─── MAIN HANDLER ─────────────────────────────────
let autoai = async (m, sock) => {
  const sender = m?.sender?.split('@')[0] || 'unknown'
  console.log('\n╔══════════════════════════════════════╗')
  console.log('║ [AUTO AI] CHAT MASUK DARI:', sender.padEnd(17), '║')
  console.log('╚══════════════════════════════════════╝')

  try {
    // ── VALIDASI DASAR ─────────────────────────
    if (!m?.message) {
      console.log('[AUTO AI] ⛔ Skip: Tidak ada message object')
      return
    }

    if (m.key?.fromMe) {
      console.log('[AUTO AI] ⛔ Skip: Pesan dari bot sendiri')
      return
    }

    // Cek status ON/OFF
    const db = readDB()
    console.log('[AUTO AI] 📊 Status:', db.on ? 'ON ✅' : 'OFF ❌')
    if (!db.on) {
      console.log('[AUTO AI] ⛔ Skip: AutoAI sedang OFF')
      return
    }

    // Cek blacklist
    if (db.blacklist?.includes(m.sender)) {
      console.log('[AUTO AI] ⛔ Skip: User di-blacklist')
      return
    }

    // ── EXTRACT TEXT ─────────────────────────────
    const text = getMessageText(m)
    console.log('[AUTO AI] 📝 Text:', text ? `"${text.slice(0, 60)}${text.length > 60 ? '...' : ''}"` : '(kosong)')
    
    if (!text || text.trim().length === 0) {
      console.log('[AUTO AI] ⛔ Skip: Text kosong (mungkin sticker/voice/location)')
      return
    }

    // ── CEK API KEY ──────────────────────────────
    const apiKey = getApiKey()
    if (!apiKey) {
      await sock.sendMessage(m.chat, { 
        text: '⚠️ *AutoAI Error*\nAPI Key belum di-set. Hubungi admin.' 
      }, { quoted: m })
      return
    }

    // ── ANTI SPAM (delay 2 detik antar request) ──
    console.log('[AUTO AI] ⏳ Delay 2 detik...')
    await delay(2000)

    // ── TYPING INDICATOR ─────────────────────────
    console.log('[AUTO AI] ✍️  Kirim typing...')
    await sock.sendPresenceUpdate('composing', m.chat)

    // ── REQUEST KE GROQ ──────────────────────────
    console.log('[AUTO AI] 🚀 Kirim ke Groq API...')
    console.log('[AUTO AI]    Model:', MODEL)
    
    const res = await axios.post(GROQ_API, {
      model: MODEL,
      messages: [
        { 
          role: 'system', 
          content: 'Kamu adalah AI assistant yang ramah dan santai. Jawab dalam bahasa Indonesia gaul yang natural, singkat tapi bermakna. Maksimal 1-2 kalimat.' 
        },
        { role: 'user', content: text }
      ],
      max_tokens: 150,
      temperature: 0.7
    }, {
      timeout: 20000, // 20 detik timeout
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    })

    // ── PROSES JAWABAN ───────────────────────────
    const jawaban = res.data?.choices?.[0]?.message?.content?.trim()
    
    if (!jawaban) {
      console.log('[AUTO AI] ⚠️ Response kosong dari API')
      await sock.sendPresenceUpdate('paused', m.chat)
      return
    }

    console.log('[AUTO AI] 💬 Jawaban:', jawaban.slice(0, 80))
    console.log('[AUTO AI] 📊 Token used:', res.data?.usage?.total_tokens || 'unknown')

    // ── KIRIM KE WA ──────────────────────────────
    await sock.sendMessage(m.chat, { text: jawaban }, { quoted: m })
    console.log('[AUTO AI] ✅ BERHASIL TERKIRIM!')

  } catch (e) {
    // ── ERROR HANDLING DETAIL ────────────────────
    console.log('[AUTO AI] ❌ ERROR TERJADI!')
    console.log('[AUTO AI]    Tipe:', e.name)
    console.log('[AUTO AI]    Pesan:', e.message)
    
    // Axios error detail
    if (e.response) {
      console.log('[AUTO AI]    Status:', e.response.status, e.response.statusText)
      console.log('[AUTO AI]    Data:', JSON.stringify(e.response.data, null, 2))
      
      // Kirim notifikasi error ke user (opsional)
      const errorMsg = e.response.status === 401 
        ? '🔑 API Key invalid atau expired' 
        : e.response.status === 429 
        ? '⏳ Rate limit, coba lagi nanti' 
        : '⚠️ AI sedang gangguan, coba lagi ya'
      
      await sock.sendMessage(m.chat, { text: errorMsg }, { quoted: m })
      
    } else if (e.code === 'ECONNABORTED') {
      console.log('[AUTO AI]    Timeout! Request terlalu lama')
      await sock.sendMessage(m.chat, { text: '⏱️ AI lama respon, coba kirim ulang' }, { quoted: m })
      
    } else if (e.code === 'ENOTFOUND') {
      console.log('[AUTO AI]    Network error, cek koneksi')
    }

  } finally {
    // ── SELALU MATIKAN TYPING ────────────────────
    try {
      await sock.sendPresenceUpdate('paused', m.chat)
      console.log('[AUTO AI] 🛑 Typing dimatikan')
    } catch (e) {
      // ignore
    }
    console.log('[AUTO AI] ─── SELESAI ───\n')
  }
}

module.exports = autoai
  

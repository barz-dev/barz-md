const fs = require('fs')
const path = './database/autolike.json'
const cacheFile = './database/swcache.json'

if (!fs.existsSync('./database')) fs.mkdirSync('./database', { recursive: true })
if (!fs.existsSync(path)) fs.writeFileSync(path, '{"on":false}')
if (!fs.existsSync(cacheFile)) fs.writeFileSync(cacheFile, '[]')

// LISTENER AUTO LIKE SW
let autolike = async (m, sock) => {
  try {
    if (!m?.message) return

    let db = JSON.parse(fs.readFileSync(path))
    if (!db.on) return

    if (m.message.statusMessage &&!m.key.fromMe) {
      let statusId = m.key.id
      let cache = JSON.parse(fs.readFileSync(cacheFile))

      if (cache.includes(statusId)) return // udah react = skip

      await new Promise(r => setTimeout(r, 2000 + Math.random() * 3000))

      await sock.readMessages([m.key])
      await sock.sendMessage('status@broadcast', {
        react: { text: '❤️', key: m.key }
      })

      cache.push(statusId)
      if (cache.length > 500) cache.shift() // jaga biar gak gede bgt
      fs.writeFileSync(cacheFile, JSON.stringify(cache))

      let nomor = m.key.participant? m.key.participant.split('@')[0] : m.key.remoteJid.split('@')[0]
      console.log(`[AUTO SW] ${nomor} -> ❤️ LIKE`)
    }
  } catch(e) {
    console.log('[AUTO SW] Error:', e.message)
  }
}

module.exports = autolike

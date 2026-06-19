const fs = require('fs')
const path = './database/autolike.json'
const cacheFile = './database/swcache.json'

// bikin DB + cache otomatis
if (!fs.existsSync('./database')) fs.mkdirSync('./database', { recursive: true })
if (!fs.existsSync(path)) fs.writeFileSync(path, '{"on":false}')
if (!fs.existsSync(cacheFile)) fs.writeFileSync(cacheFile, '[]')

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
    return m.reply('❌ Done Tuan')
  }
  if (args[0] === 'reset') {
    fs.writeFileSync(cacheFile, '[]')
    return m.reply('✅ Cache reset')
  }
  m.reply(`Status: ${db.on? 'ON ✅' : 'OFF ❌'}\n.autolikesw on/off/reset`)
}
handler.command = ['autolikesw']
handler.owner = true
module.exports = handler

// LISTENER
setTimeout(async () => {
  let sock = global.conn || global.sock || global.client
  if (!sock) return console.log('[AUTO SW] Gagal ambil sock')

  sock.ev.on('messages.upsert', async ({ messages }) => {
    let msg = messages[0]
    if (!msg?.message) return

    let db = JSON.parse(fs.readFileSync(path))
    if (!db.on) return

    if (msg.message.statusMessage &&!msg.key.fromMe) {
      let statusId = msg.key.id
      let cache = JSON.parse(fs.readFileSync(cacheFile))

      if (cache.includes(statusId)) return // udah react = skip

      try {
        await new Promise(r => setTimeout(r, 2000 + Math.random() * 3000)) // delay 2-5 detik

        await sock.readMessages([msg.key])

        
        await sock.sendMessage('status@broadcast', {
          react: { text: '❤️', key: msg.key }
        })

        cache.push(statusId)
        fs.writeFileSync(cacheFile, JSON.stringify(cache))

        let nomor = msg.key.participant? msg.key.participant.split('@')[0] : msg.key.remoteJid.split('@')[0]
        console.log(`[AUTO SW] ${nomor} -> ❤️ LIKE`)

      } catch(e) {
        console.log('[AUTO SW] Error:', e.message)
      }
    }
  })
}, 5000)

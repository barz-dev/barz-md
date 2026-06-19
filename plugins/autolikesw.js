const fs = require('fs')
const path = './database/autolike.json'
const cacheFile = './database/swcache.json'

// bikin DB + cache otomatis
if (!fs.existsSync('./database')) fs.mkdirSync('./database', { recursive: true })
if (!fs.existsSync(path)) fs.writeFileSync(path, '{"on":false}')
if (!fs.existsSync(cacheFile)) fs.writeFileSync(cacheFile, '[]')

// COMMAND HANDLER
let command = async (m, { args, isOwner }) => {
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
command.command = ['autolikesw']
command.owner = true

// LISTENER FUNCTION - INI YG DIPANGGIL DARI INDEX.JS
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
      fs.writeFileSync(cacheFile, JSON.stringify(cache))

      let nomor = m.key.participant? m.key.participant.split('@')[0] : m.key.remoteJid.split('@')[0]
      console.log(`[AUTO SW] ${nomor} -> ❤️ LIKE`)
    }
  } catch(e) {
    console.log('[AUTO SW] Error:', e.message)
  }
}

module.exports = autolike
module.exports.command = command

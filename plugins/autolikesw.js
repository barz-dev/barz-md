const fs = require('fs')
let file = './database/autolike.json'

// bikin DB otomatis
if (!fs.existsSync('./database')) fs.mkdirSync('./database')
if (!fs.existsSync(file)) fs.writeFileSync(file, '{"on":false}')

let handler = async (m, { args, isOwner }) => {
  if (!isOwner) return
  let db = JSON.parse(fs.readFileSync(file))

  if (args[0] === 'on') {
    db.on = true
    fs.writeFileSync(file, JSON.stringify(db))
    m.reply('✅ Auto stalker SW ON\nSemua status kontak + grup bakal auto liat + like')
  } else if (args[0] === 'off') {
    db.on = false
    fs.writeFileSync(file, JSON.stringify(db))
    m.reply('❌ Auto stalker SW OFF')
  } else {
    m.reply(`Status: ${db.on? 'ON' : 'OFF'}\n.autolikesw on/off`)
  }
}
handler.command = ['autolikesw']
handler.owner = true
module.exports = handler

// listener auto jalan pas plugin ke-load
setTimeout(async () => {
  let sock = global.conn || global.sock
  if (!sock) return console.log('[SW] Gagal ambil sock')

  sock.ev.on('messages.upsert', async ({ messages }) => {
    let msg = messages[0]
    if (!msg?.message) return

    let db = JSON.parse(fs.readFileSync(file))
    if (!db.on) return

    // deteksi status baru masuk
    if (msg.message.statusMessage) {
      if (msg.key.fromMe) return // skip status sendiri

      try {
        // 1. auto liat
        await sock.readMessages([msg.key])

        // 2. auto like random
        let emoji = ['❤️','🔥','👍','😍','✨'][Math.floor(Math.random()*5)]
        await sock.sendMessage(msg.key.remoteJid, {
          react: { text: emoji, key: msg.key }
        })
        console.log(`[SW] ${msg.key.remoteJid.split('@')[0]} -> ${emoji}`)
      } catch(e) {}
    }
  })
}, 5000)

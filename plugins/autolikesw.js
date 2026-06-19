const fs = require('fs')
const path = require('path')
let dbFile = path.join(__dirname, '../database/autolike.json')

// Auto create folder + file DB kalo belum ada
function initDB() {
  let dir = path.dirname(dbFile)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, JSON.stringify({ status: false }, null, 2))
}
initDB()

function readDB() {
  try {
    return JSON.parse(fs.readFileSync(dbFile))
  } catch {
    return { status: false }
  }
}

function saveDB(data) {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2))
}

let handler = async (m, { sock, args, isOwner }) => {
  if (!isOwner) throw 'Fitur owner doang bang'

  initDB() // pastiin DB ada dulu
  let db = readDB()
  let status = args[0]?.toLowerCase()

  if (!status) throw 'Contoh:.autolikesw on / off\nStatus sekarang: ' + (db.status? 'ON ✅' : 'OFF ❌')

  if (status === 'on') {
    db.status = true
    saveDB(db)
    m.reply('✅ Done Cung')
  }
  else if (status === 'off') {
    db.status = false
    saveDB(db)
    m.reply('❌ Auto like SW dimatiin')
  }
  else {
    m.reply('Pilih on/off bang')
  }
}

// Event listener
let autolike = async (m, sock) => {
  initDB()
  let db = readDB()
  if (!db.status) return

  sock.ev.on('messages.upsert', async ({ messages }) => {
    let msg = messages[0]
    if (!msg?.message) return

    // 1. Auto like semua status yang masuk
    if (msg.message.statusMessage) {
      if (msg.key.fromMe) return
      try {
        await sock.readMessages([msg.key])
        let emojis = ['❤️','🔥','👍','😍','✨']
        let emoji = emojis[Math.floor(Math.random() * emojis.length)]
        await sock.sendMessage(msg.key.remoteJid, {
          react: { text: emoji, key: msg.key }
        })
        console.log('[AUTO SW] Like:', emoji, msg.key.remoteJid)
      } catch(e) {}
    }

    // 2. Kalo ada yang tag "sw" di grup
    if (msg.message.conversation?.toLowerCase().includes('sw') && msg.key.remoteJid.endsWith('@g.us')) {
      let sender = msg.key.participant
      try {
        let status = await sock.fetchStatus(sender)
        if (status?.status?.length > 0) {
          let latest = status.status[0]
          await sock.readMessages([{ remoteJid: sender, id: latest.id, fromMe: false }])
          let emojis = ['❤️','🔥','👍']
          let emoji = emojis[Math.floor(Math.random() * emojis.length)]
          await sock.sendMessage(sender, {
            react: { text: emoji, key: latest }
          })
          await sock.sendMessage(msg.key.remoteJid, {
            text: `Udah gue liat + like SW @${sender.split('@')[0]} 🔥`,
            mentions: [sender]
          }, { quoted: msg })
        }
      } catch(e) {
        console.log('Gagal ambil SW:', e.message)
      }
    }
  })
}

handler.command = ['autolikesw']
handler.owner = true
module.exports = { handler, autolike }

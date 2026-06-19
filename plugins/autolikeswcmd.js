const fs = require('fs')
const path = './database/autolike.json'
const cacheFile = './database/swcache.json'

let handler = async (m, { args, isOwner }) => {
  if (!isOwner) return m.reply('❌ Owner only bang')

  let db = JSON.parse(fs.readFileSync(path))

  if (args[0] === 'on') {
    db.on = true
    fs.writeFileSync(path, JSON.stringify(db))
    return m.reply('✅ Sip')
  }
  if (args[0] === 'off') {
    db.on = false
    fs.writeFileSync(path, JSON.stringify(db))
    return m.reply('❌ Hooh')
  }
  if (args[0] === 'reset') {
    fs.writeFileSync(cacheFile, '[]')
    return m.reply('✅ Cache SW direset')
  }
  m.reply(`📊 Status: ${db.on? 'ON ✅' : 'OFF ❌'}\n.autolikesw on/off/reset`)
}
handler.command = ['autolikesw']
handler.owner = true
module.exports = handler

const fs = require('fs')
const path = './database/autoai.json'
const historyPath = './database/ai_history.json'

let handler = async (m, { args, isOwner }) => {
  if (!isOwner) return m.reply('❌ Khusus Owner doang Tuan')

  let db = JSON.parse(fs.readFileSync(path))

  if (args[0] === 'on') {
    db.on = true
    fs.writeFileSync(path, JSON.stringify(db))
    return m.reply('✅  Sipp')
  }

  if (args[0] === 'off') {
    db.on = false
    fs.writeFileSync(path, JSON.stringify(db))
    return m.reply('❌ Done Su')
  }

  if (args[0] === 'clear') {
    fs.writeFileSync(historyPath, '{}')
    return m.reply('✅ History AI dihapus\nMemory bot direset')
  }

  m.reply(`📊 Status Auto AI: ${db.on? 'ON ✅' : 'OFF ❌'}\n\nCommand:\n.autoai on - nyalain\n.autoai off - matiin\n.autoai clear - hapus memory`)
}
handler.command = ['autoai']
handler.owner = true
module.exports = handler

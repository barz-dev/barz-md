let handler = async (m, { sock, text, isAdmin, isOwner }) => {
  let chat = global.db.data.chats[m.chat] = global.db.data.chats[m.chat] || {}
  chat.autoai = chat.autoai || {}
  chat.autoai.history = chat.autoai.history || {}

  if (/on|enable|true/i.test(text)) {
    chat.autoai.status = true
    return m.reply(`✅ AutoAI On`)
  }
  else if (/off|disable|false/i.test(text)) {
    chat.autoai.status = false
    return m.reply('❌ AutoAI DIMATIKAN')
  }
  else if (/reset/i.test(text)) {
    chat.autoai.history = {}
    return m.reply('✅ History AutoAI dihapus. Bot amnesia wkwk')
  }
  else {
    let status = chat.autoai.status? 'AKTIF ✅' : 'MATI ❌'
    return m.reply(`Status: ${status}\n.autoai on/off/reset`)
  }
}

handler.help = ['autoai on/off/reset']
handler.tags = ['tools']
handler.command = ['autoai']
// ga pake handler.group = true biar bisa di PC juga

handler.before = async function(m, { sock }) {
  let chat = global.db.data.chats[m.chat] || {}
  if (!chat.autoai?.status) return
  if (m.key.fromMe) return
  if (!m.text) return

  let botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net'
  let isReply = m.quoted && m.quoted.sender === botNumber
  let isMention = m.mentionedJid && m.mentionedJid.includes(botNumber)
  let isTrigger = /bot\s*oy|bot\s*p|${global.packname}/i.test(m.text || '')

  if (!isReply &&!isMention &&!isTrigger) return

  let userId = m.sender
  chat.autoai.history[userId] = chat.autoai.history[userId] || []
  let history = chat.autoai.history[userId]

  // Simpan chat user
  history.push({ role: 'user', content: m.text })
  if (history.length > 12) history.shift() // simpan 6 chat bolak-balik

  let prompt = `Kamu adalah ${global.packname}, bot WhatsApp yang yapping, ngeselin, roasting dikit, tapi lucu.
  Jawab singkat max 2 kalimat, bahasa gaul Indonesia. Ingat chat sebelumnya.`

  try {
    let res = await fetch(`https://api.ikyzapi.com/ai/gpt?text=${encodeURIComponent(prompt + '\nUser: ' + m.text)}&apikey=ikyzapi`)
    let json = await res.json()

    let reply = json.result || json.data || 'Lah API nya ngambek bang wkwk'

    // Simpan jawaban bot
    history.push({ role: 'assistant', content: reply })

    await sock.sendMessage(m.chat, { text: reply }, { quoted: m })
  } catch(e) {
    console.log(e)
    await sock.sendMessage(m.chat, { text: 'API Iky error, otak gue bluescreen wkwk' }, { quoted: m })
  }
}

module.exports = handler

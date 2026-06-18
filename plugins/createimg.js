let handler = async (m, { sock, text }) => {
  if (!text) return m.reply(`Contoh:\n.aiimg cewek anime rambut pink pake kimono\nKeyword bebas bang`)
  
  await m.reply(`Ngegambar... tunggu 10-15 detik 🎨`)
  
  try {
    // Pake media.create_image tool bawaan Meta AI
    const prompt = `high quality, detailed, 8k, ${text}`
    await media.create_image({ prompt })
    
  } catch(e) {
    console.log(e)
    m.reply(`Gagal generate bang 😭\nPrompt: ${text}`)
  }
}

handler.help = ['aiimg <prompt>']
handler.tags = ['ai'] // masuk kategori 𝗔𝗜 ◈
handler.command = ['aiimg', 'genimg', 'createimg']
handler.limit = true // biar gak spam

module.exports = handler
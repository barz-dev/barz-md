async function aiLuminai(history, userId) {
  const text = history[history.length-1].content
  const botName = global.packname || 'AI Bot'

  let prompt = `Kamu ${botName}, AI assistant ramah. Jawab singkat padat bahasa Indonesia gaul max 3 baris\n`
  history.slice(-8, -1).forEach(h => {
    prompt += `${h.role === 'user'? 'User' : botName}: ${h.content}\n`
  })
  prompt += `User: ${text}\n${botName}:`

  try {
    const encodedPrompt = encodeURIComponent(prompt)
    const url = `https://api.siputzx.my.id/api/ai/glm47flash?prompt=${encodedPrompt}`

    console.log('[GLM] URL:', url) // buat debug
    const res = await axios.get(url, {
      timeout: 20000,
      headers: {'User-Agent': 'Mozilla/5.0'}
    })

    console.log('[GLM] Status:', res.data.status) // debug
    console.log('[GLM] Data:', res.data) // debug

    if (res.data && res.data.status === true) {
      let jawaban = res.data.response || res.data || res.data.result
      if (jawaban) return jawaban.trim()
    }
    return 'AI gak ngasih jawaban bang 😅'
  } catch (e) {
    console.log('[GLM47FLASH] ERROR FULL:', e.message)
    console.log('[GLM47FLASH] Response:', e.response?.data)
    return 'Endpoint Siputzx error: ' + e.message
  }
}

const fs = require("fs")
const path = require("path")
const axios = require("axios")


const db = path.join(process.cwd(), "database")
const cacheFile = path.join(db, "cache.js")


if (!fs.existsSync(db)) {
  fs.mkdirSync(db)
}


if (!fs.existsSync(cacheFile)) {
  fs.writeFileSync(
    cacheFile,
`module.exports = {
  autoAI: false,
  historyAI: {}
}`
  )
}


let cache = require(cacheFile)


function saveCache() {
  fs.writeFileSync(
    cacheFile,
    "module.exports = " +
    JSON.stringify(cache, null, 2)
  )
}



function getMenu() {

  try {

    return fs.readFileSync(
      path.join(process.cwd(), "menu.js"),
      "utf-8"
    )

  } catch {

    return "menu.js tidak ditemukan"

  }

}




let handler = async (m, { sock, text }) => {


  if (!text) {

    return m.reply(
      `AutoAI Global : ${cache.autoAI ? "ON" : "OFF"}

Contoh:
.autoai on
.autoai off`
    )

  }



  if (text.toLowerCase() === "on") {

    cache.autoAI = true
    saveCache()

    return m.reply(
      "AutoAI global aktif ✅\nSemua grup & private"
    )

  }



  if (text.toLowerCase() === "off") {

    cache.autoAI = false
    cache.historyAI = {}
    saveCache()

    return m.reply(
      "AutoAI global mati ❌"
    )

  }


}



handler.command = ["autoai"]
handler.help = ["autoai on/off"]
handler.tags = ["ai"]


module.exports = handler





handler.before = async (m,{sock}) => {


  if (!cache.autoAI) return
  if (!m.text) return
  if (m.fromMe) return



  let bot =
  sock.user.id.split(":")[0] +
  "@s.whatsapp.net"



  let trigger =
    m.mentionedJid?.includes(bot) ||
    m.quoted?.sender === bot ||
    m.text.toLowerCase().startsWith("bot")



  if (!trigger) return



  let id = m.chat



  if (!cache.historyAI[id])
    cache.historyAI[id] = []



  cache.historyAI[id].push({
    role:"user",
    content:m.text
  })



  if(cache.historyAI[id].length > 15)
    cache.historyAI[id].shift()



  try {



    let menu = getMenu()



    let res = await axios.get(
      "https://api.siputzx.my.id/api/ai/chat",
      {
        params:{

          message:m.text,


          history:
          JSON.stringify(
            cache.historyAI[id]
          ),


          system:
`
Nama kamu ${global.packname || "AI"}.

Kamu adalah AI assistant WhatsApp.

Kamu punya akses fitur bot dari menu.js:

${menu}


Aturan:
- Jika user tanya fitur bot, cek menu.js.
- Kasih contoh command yang benar.
- Jangan bikin command palsu.
- Kalau user tanya gambar, arahkan ke command image jika ada.
- Jawab santai bahasa Indonesia.
- Jangan spam.

`
        },

        timeout:30000

      }
    )



    let reply =
    res.data.result ||
    res.data.response ||
    res.data.message ||
    "AI tidak menjawab"



    cache.historyAI[id].push({

      role:"assistant",
      content:reply

    })


    saveCache()



    await sock.sendMessage(
      id,
      {
        text:reply
      },
      {
        quoted:m
      }
    )



  } catch(e) {

    console.log(
      "AUTOAI ERROR:",
      e.message
    )

  }


}

const fs = require("fs")
const path = require("path")
const axios = require("axios")

const db = path.join(process.cwd(), "database")
const file = path.join(db, "cache.js")

if (!fs.existsSync(db)) fs.mkdirSync(db)

if (!fs.existsSync(file)) {
  fs.writeFileSync(file, `
module.exports = {
 autoAI:false,
 historyAI:{}
}
`)
}

let cache = require(file)

const save = () => {
  fs.writeFileSync(
    file,
    "module.exports = " + JSON.stringify(cache, null, 2)
  )
}


let handler = async (m,{sock,text}) => {

  if (!text)
    return m.reply(`AutoAI ${cache.autoAI ? "ON":"OFF"}

.autoai on
.autoai off`)


  if(text == "on") {
    cache.autoAI = true
    save()
    return m.reply("AutoAI aktif")
  }


  if(text == "off") {
    cache.autoAI = false
    save()
    return m.reply("AutoAI mati")
  }

}


handler.before = async (m,{sock}) => {

  console.log("AUTOAI CHECK:", m.text)


  if(!cache.autoAI) return
  if(!m.text) return
  if(m.fromMe) return


  let bot =
  sock.user.id.split(":")[0] + "@s.whatsapp.net"


  let hit =
  m.mentionedJid?.includes(bot) ||
  m.quoted?.sender == bot ||
  m.text.toLowerCase().startsWith("bot")


  if(!hit) return


  await m.reply("sebentar...")


  try {


    let r = await axios.get(
      "https://api.siputzx.my.id/api/ai/chat",
      {
        params:{
          message:m.text,
          system:
          `Kamu AI WhatsApp. Jawab bahasa Indonesia.`
        }
      }
    )


    let ans =
    r.data.result ||
    r.data.response ||
    r.data.message


    await sock.sendMessage(
      m.chat,
      {
        text: ans
      },
      {
        quoted:m
      }
    )


  } catch(e){

    console.log(e)
    m.reply("AI error")

  }

}


handler.command = ["autoai"]
handler.tags = ["ai"]
handler.help = ["autoai on/off"]


module.exports = handler

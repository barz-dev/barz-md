// plugins/ceksange.js

let handler = async (m, { cmd, text }) => {
  let target = text?.trim() || m.pushName
  
  const score = Math.floor(Math.random() * 101)
  
  const komen = [
    // 0-30: Normal
    "Aman, masih waras",
    "Sange lu terkontrol bang",
    "Normal, ga bahaya",
    "Masih bisa diajak ngobrol",
    
    // 31-60: Lumayan
    "Udah mulai mikir aneh2",
    "Liat cewe dikit langsung...",
    "Hati2 bang kebablasan",
    "Mending tidur dulu",
    
    // 61-90: Bahaya
    "Tolong nurunin sange nya",
    "Gelas sebelah lu basah ga?",
    "Kontrol bang kontrol",
    "Jangan di liat terus",
    
    // 91-100: Parah
    "INI UDAH GA NORMAL",
    "Panggil ustadz bang",
    "Sange +9999",
    "Lu butuh air dingin"
  ]
  
  let pick = score < 30 ? komen[0 + Math.floor(Math.random()*4)] :
             score < 60 ? komen[4 + Math.floor(Math.random()*4)] :
             score < 90 ? komen[8 + Math.floor(Math.random()*4)] :
             komen[12 + Math.floor(Math.random()*4)]

  m.reply(
`Nama: ${target}
Sange: ${score}%
Note: ${pick}`
  )
}

handler.command = ["ceksange", "sangecek"]
handler.tags = ["fun"]
handler.help = ["ceksange @tag/nama"]
module.exports = handler

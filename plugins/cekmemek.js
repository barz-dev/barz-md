// plugins/cekmemek.js

let handler = async (m, { text, command }) => {
  let target = text?.trim() || m.pushName || 'Anonim'

  const score = Math.floor(Math.random() * 101)

  const statusMemek = [
    // 0-25: Rusak
    'Kering kayak gurun sahara',
    'Udah kayak perang dunia 3',
    'Kasian banget, butuh renovasi',
    'Udah ga layak pake',
    
    // 26-50: Standar
    'Standar pabrikan doang',
    'Biasa aja, nothing special',
    'Masih oke lah buat diliat',
    'Warung tutup, butuh perbaikan',
    
    // 51-75: Bagus
    'Basah, wangi, siap tempur',
    'Mulus kayak tembok baru',
    'Kayak bunga mekar di pagi hari',
    'Bikin pengen deketin terus',
    
    // 76-100: Legendaris
    'LEVEL DEWA, BIKIN LUPA HUTANG',
    'MEMEK NYA BIKIN GILA',
    'WANGI MELATI SEJATI',
    'SAYANGAN IBU, BIKIN TENTERAM'
  ]

  let pick = score < 25 ? statusMemek[0 + Math.floor(Math.random() * 4)] :
             score < 50 ? statusMemek[4 + Math.floor(Math.random() * 4)] :
             score < 75 ? statusMemek[8 + Math.floor(Math.random() * 4)] :
             statusMemek[12 + Math.floor(Math.random() * 4)]

  let kata = [
    'Hasil ini berdasarkan zodiak dan weton',
    'Disertifikasi sama tetua bot',
    'Kalo ga percaya cek pake teropong',
    'Bikin lo nanya "ini bot apaan?"',
    'Kalo baper tanggung sendiri',
    'Skor bisa berubah kaya mantan',
    'Hasil konsultasi sama dukun bot',
    'Valid sampe lo lupa'
  ]

  let note = kata[Math.floor(Math.random() * kata.length)]

  m.reply(
`╭─「 CEK MEMEK 」
│
│  nama: ${target}
│  skor: ${score}%
│  status: ${pick}
│  note: ${note}
╰─「 🍑 」
  `.trim())
}

handler.command = ['cekmemek']
handler.tags = ['fun']
handler.help = ['cekmemek nama']

module.exports = handler

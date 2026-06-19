// plugins/cekkontol.js

let handler = async (m, { text, command }) => {
  let target = text?.trim() || m.pushName || 'Anonim'

  const score = Math.floor(Math.random() * 101)

  const statusKontol = [
    // 0-25: Rusak
    'Lemes kayak mie kelewat rebus',
    'Udah pensiun jualan cilok',
    'Kecil kayak jari kelingking',
    'Ga layak pake, buang aja',
    
    // 26-50: Standar
    'Standar pabrikan doang',
    'Biasa aja, nothing special',
    'Masih oke lah buat dipake',
    'Kayak pentol bakso, kenyal',
    
    // 51-75: Bagus
    'Keras, tegar, siap tempur',
    'Panjang kayak jalan tol',
    'Kuat kayak baja karbon',
    'Bikin pengen pegang terus',
    
    // 76-100: Legendaris
    'LEVEL DEWA, ANTI GEMPA',
    'KONTOL NYA BIKIN GILA',
    'SEKERAS BAJA, TAHAN BANTING',
    'SAYANGAN IBU, BIKIN TENTERAM'
  ]

  let pick = score < 25 ? statusKontol[0 + Math.floor(Math.random() * 4)] :
             score < 50 ? statusKontol[4 + Math.floor(Math.random() * 4)] :
             score < 75 ? statusKontol[8 + Math.floor(Math.random() * 4)] :
             statusKontol[12 + Math.floor(Math.random() * 4)]

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
`╭─「 CEK KONTOL 」
│
│  nama: ${target}
│  skor: ${score}%
│  status: ${pick}
│  note: ${note}
╰─「 🍆 」
  `.trim())
}

handler.command = ['cekkontol']
handler.tags = ['fun']
handler.help = ['cekkontol nama']

module.exports = handler

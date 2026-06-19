
const fs = require('fs')

let handler = async (m, sock) => {
    let text = m.body?.trim() || ''
    let command = text.split(' ')[0].toLowerCase().replace('.', '')
    let targetName = text.replace(/\.cekmemek|\.cekkontol/i, '').trim() || m.pushName || 'Anonim'

    let isMemek = command === 'cekmemek'
    let label = isMemek ? 'memek' : 'kontol'
    let emoji = isMemek ? '🍑' : '🍆'

    let skor = Math.floor(Math.random() * 100) + 1

    let statusList = [
        { min: 90, label: 'LEGENDARY', desc: isMemek ? 'level dewa, wangi melati' : 'level dewa, keras kayak baja' },
        { min: 80, label: 'PRIME', desc: isMemek ? 'premium, viral di grup' : 'pro max, panjang kayak tol' },
        { min: 70, label: 'GACOR', desc: isMemek ? 'siap tempur kapan aja' : 'siap tempur kapan aja' },
        { min: 60, label: 'STANDARD', desc: isMemek ? 'standar pabrikan' : 'standar, kayak pentol' },
        { min: 50, label: 'MID', desc: isMemek ? 'mid doang' : 'mid doang' },
        { min: 40, label: 'PERLU SERVICE', desc: isMemek ? 'kayak warung tutup' : 'lembek kayak mie' },
        { min: 30, label: 'DROP', desc: isMemek ? 'udah drop' : 'udah drop' },
        { min: 20, label: 'RUSAK', desc: isMemek ? 'kayak perang dunia' : 'pensiun jualan cilok' },
        { min: 10, label: 'ANJAY', desc: isMemek ? 'ini monster' : 'ini tongkat' },
        { min: 0, label: 'MYSTERY', desc: isMemek ? 'dari planet lain' : 'misterius' }
    ]

    let status = statusList.find(s => skor >= s.min) || statusList[statusList.length - 1]

    let quotes = [
        'hasil ini berdasarkan zodiak dan weton',
        'udah disertifikasi tetua bot',
        'berlaku 24 jam, bisa berubah kayak mantan',
        'kalo ga percaya, cek pake teropong',
        'hasil konsultasi sama dukun bot',
        'kalo skor kecil, jangan sedih',
        'skor bisa naik kalo mandi air kelapa',
        'bikin lo nanya "ini bot apaan?"',
        'validasi dari tim gajian pake ketawa',
        'kalo lo senyum, lo normal',
        'udah ditandatanganin RT setempat',
        'berdasarkan penelitian universitas kebon',
        'kalo skor tinggi, lo beruntung',
        'bisa berubah kalo lagi puasa',
        'udah dicek kucing tetangga',
        'kalo baper, salah lo sendiri',
        'ini random tapi serius',
        'valid kayak ramalan pasar minggu',
        'di approve admin bot ga jelas',
        'ketik ulang kalo ga suka'
    ]

    let quote = quotes[Math.floor(Math.random() * quotes.length)]

    let caption = `
╭─「 CEK ${label.toUpperCase()} 」
│
│  nama: ${targetName}
│  skor: ${skor}%
│  status: ${status.label}
│  desc: ${status.desc}
│  note: ${quote}
│
│   level: ${Math.floor(Math.random() * 100) + 1}%
│  valid: sampai lo lupa
╰─「 ${emoji} 」
    `.trim()

    await sock.sendMessage(m.chat, { text: caption }, { quoted: m })
}

handler.command = ['cekmemek', 'cekkontol']
handler.tags = ['fun']
handler.help = ['.cekmemek nama', '.cekkontol nama']

module.exports = handler

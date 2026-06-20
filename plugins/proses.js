let handler = async (m, { sock, text, command }) => {
  if (!text) {
    if (command === 'proses') return m.reply(`*Format:*\n.proses Jasa Bikin Web,1 jam\n*Contoh:* .proses Jasa Install Panel,30 menit`)
    if (command === 'done') return m.reply(`*Format:*\n.done Jasa Bikin Web,50000\n*Contoh:* .done Jasa Install Panel,25000`)
  }

  // Parse input: produk/jasa,waktu atau produk,harga
  let [nama, value] = text.split(',').map(v => v.trim())
  if (!nama || !value) return m.reply('Format salah bang. Pake koma "," buat pisahin')

  const isDone = command === "done"
  
  let title, note, amount
  
  if (isDone) {
    // .done produk,harga
    let harga = parseInt(value.replace(/\D/g, '')) // hapus titik/koma/Rp
    if (isNaN(harga)) return m.reply('Harga harus angka bang. Contoh: 50000')
    
    title = `✅ Pesanan Selesai`
    note = `Produk: ${nama}\nHarga: Rp${harga.toLocaleString('id-ID')}`
    amount = harga * 100 // offset 100 = 2 digit desimal
    
  } else {
    // .proses produk/jasa,waktu  
    title = `⏳ Sedang Diproses`
    note = `Produk/Jasa: ${nama}\nEstimasi: ${value}`
    amount = 1 * 100 // nominal 0.01 biar bisa muncul button nya
  }

  const message = {
    text: `*${title}*\n\n${note}`,
    interactiveMessage: {
      nativeFlowMessage: {
        buttons: [
          {
            name: "review_and_pay",
            buttonParamsJson: JSON.stringify({
              currency: "IDR",
              total_amount: {
                value: amount,
                offset: 100
              },
              reference_id: `${Date.now()}`,
              type: "physical-goods",
              payment_status: isDone ? "captured" : "pending",
              payment_timestamp: Math.floor(Date.now() / 1000),
              order: {
                status: isDone ? "completed" : "processing",
                subtotal: {
                  value: amount,
                  offset: 100
                },
                order_type: "PAYMENT_REQUEST",
                items: [
                  {
                    retailer_id: `custom-${Date.now()}`,
                    name: nama,
                    amount: {
                      value: amount,
                      offset: 100
                    },
                    quantity: 1
                  }
                ]
              },
              additional_note: note,
              native_payment_methods: [],
              share_payment_status: false,
              is_soft_deleted: false
            })
          }
        ]
      }
    }
  }

  await sock.relayMessage(m.chat, message, {
    userJid: m.chat
  })
}

handler.command = ["proses", "done"]
handler.tags = ["store"]
handler.help = ["proses <produk>,<waktu>", "done <produk>,<harga>"]
handler.owner = true

module.exports = handler

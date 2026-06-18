// plugins/fun-confess.js — Menfess Anonim Fix Ourin MD 3

if (!global.confessData) global.confessData = new Map();

let handler = async (m, { sock, cmd }) => {
  const input = (m.text || "").trim();

  if (!input ||!input.includes("|")) {
    return m.reply(
`💌 *LAYAN MENFESS ANONIM* 💌

Mau kirim pesan rahasia tanpa ketahuan?

*Cara Pakai:*
> \`${cmd} nomor|pesan\`

*Contoh:*
> \`${cmd} 6281234567890|Hai, aku suka kamu!\`

> 🤫 _Identitas kamu 100% dirahasiakan!_`
    );
  }

  const [rawNumber,...msgParts] = input.split("|");
  let message = msgParts.join("|").trim();
  let targetNum = rawNumber.trim().replace(/[^0-9]/g, "");

  // Fix format nomor 62
  if (targetNum.startsWith("0")) targetNum = "62" + targetNum.slice(1);
  else if (!targetNum.startsWith("62")) targetNum = "62" + targetNum;

  // Validasi
  if (!targetNum || targetNum.length < 10 || targetNum.length > 15)
    return m.reply("❌ Nomor tidak valid! Contoh: 6281234567890");
  if (!message || message.length < 5)
    return m.reply("❌ Pesan terlalu pendek! Minimal 5 karakter.");
  if (message.length > 1000)
    return m.reply("❌ Pesan terlalu panjang! Maks 1000 karakter.");

  const targetJid = targetNum + "@s.whatsapp.net";
  const senderJid = m.sender;

  if (targetJid === senderJid)
    return m.reply("❌ Nggak bisa menfess ke diri sendiri!");

  console.log(`[MENFESS] Dari: ${senderJid} → Ke: ${targetJid}`);

  try {
    // Cek WA valid - fix bug onWhatsApp
    const check = await sock.onWhatsApp(targetNum).catch(() => []);
    const onWa = Array.isArray(check)? check[0] : check;

    if (!onWa?.exists) {
      console.log(`[MENFESS] Gagal: Nomor ${targetNum} tidak terdaftar WA`);
      return m.reply(`❌ Nomor \`${targetNum}\` tidak terdaftar di WhatsApp!`);
    }
    console.log(`[MENFESS] Nomor valid: ${targetNum}`);

  } catch (e) {
    console.error("[MENFESS] Error cek WA:", e);
    return m.reply("❌ Gagal cek nomor. Coba lagi.");
  }

  try {
    const confMsg =
`💌 *ADA PESAN RAHASIA BUAT KAMU!* 💌

Seseorang mengirim pesan secara anonim:

💬 *Isi Pesan:*
\`\`${message}\`\`

> 🔒 _Pesan ini dikirim anonim_
> ✉️ _Kamu bisa REPLY pesan ini untuk membalas!_`;

    const sentMsg = await sock.sendMessage(targetJid, { text: confMsg });

    console.log(`[MENFESS] Terkirim! ID: ${sentMsg.key.id}`); // Debug penting

    // Simpan mapping buat reply
    global.confessData.set(sentMsg.key.id, {
      senderJid,
      senderChat: m.chat,
      targetJid,
      createdAt: Date.now(),
    });

    // Auto delete 24 jam
    setTimeout(() => global.confessData.delete(sentMsg.key.id), 24 * 60 * 60 * 1000);

    await m.reply(
`✅ *MENFESS TERKIRIM!*

> 📱 Ke: \`${targetNum}\`
> 🆔 ID: \`${sentMsg.key.id}\`
> 🔒 Identitas kamu aman!

_Kalau dia balas, pesannya akan diterusin ke sini_ 😉`
    );

  } catch (err) {
    console.error("[MENFESS] Error kirim:", err);
    m.reply("❌ Gagal mengirim menfess: " + err.message);
  }
};

// Before hook untuk handle reply
handler.before = async function (m, { sock }) {
  if (!m.quoted) return false;

  const quotedId = m.quoted?.id || m.quoted?.key?.id;
  if (!quotedId) return false;

  const info = global.confessData.get(quotedId);
  if (!info) return false;
  if (m.sender!== info.targetJid) return false;

  const reply = (m.body || m.text || "").trim();
  if (!reply) return false;

  try {
    await sock.sendMessage(info.senderChat, {
      text:
`💌 *BALASAN MENFESS KAMU!*

Orang yang kamu kirimin menfess tadi balas:

💬 *Balasan:*
\`\`${reply}\`\`

> 🔒 _Identitas kamu tetap aman!_`
    });

    await sock.sendMessage(m.chat, { text: "✅ Balasan kamu sudah diteruskan!" });
    global.confessData.delete(quotedId);
    console.log(`[MENFESS] Balasan diteruskan. ID: ${quotedId}`);
    return true;
  } catch (e) {
    console.error("[MENFESS] Error forward balas:", e);
    return false;
  }
};

handler.command = ["confess", "menfess", "anonim", "kirimpesan"];
handler.tags = ["fun"];
handler.help = ["confess nomor|pesan"];
module.exports = handler;

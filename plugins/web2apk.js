const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { promisify } = require("util");
const execPromise = promisify(exec);

const sessions = {}; // state per user

let handler = async (m, { sock, text, command, usedPrefix }) => {
  const sender = m.sender;
  const msgId = m.key.id;

  // Inisialisasi session baru
  if (command === "web2apk" &&!sessions[sender]) {
    sessions[sender] = { step: 1 };
    return m.reply(
      `🌐 *WEB2APK BUILDER*\n\n` +
      `Step 1/3: Masukan *Nama App*\n` +
      `Reply pesan ini. Contoh: MyAlp`
    );
  }

  const s = sessions[sender];
  if (!s) return; // kalo ga ada session diem aja

  // STEP 1: SET NAMA APP
  if (s.step === 1) {
    s.appName = text.trim().replace(/[^a-zA-Z0-9]/g, ""); // buang simbol biar aman
    if (s.appName.length < 3) return m.reply("❌ Nama minimal 3 huruf");
    s.step = 2;
    return m.reply(
      `✅ Nama apk telah di set ke *${s.appName}*\n\n` +
      `Step 2/3: Masukan *URL Web* lu\n` +
      `Contoh: https://barz.web.id`
    );
  }

  // STEP 2: SET URL
  if (s.step === 2) {
    if (!text.startsWith("http")) return m.reply("❌ URL harus pake http/https");
    s.url = text;
    s.step = 3;

    // Kirim pesan + BUTTON SKIP
    return sock.sendMessage(m.chat, {
      text: `✅ Oke Udah\n` +
            `Step 3/3: Kirim *logo/icon* sambil reply pesan ini\n` +
            `atau klik button di bawah untuk pake icon default`,
      buttons: [
        { buttonId: `.web2apk_skip ${sender}`, buttonText: { displayText: '⏭️ Skip Icon' }, type: 1 }
      ],
      headerType: 1
    }, { quoted: m });
  }

  // STEP 3: TERIMA LOGO VIA REPLY GAMBAR
  if (s.step === 3 && m.quoted?.id === s.logoMsgId && m.mtype === "imageMessage") {
    s.logo = await sock.downloadMediaMessage(m.quoted);
    return startBuild(sock, m, sender);
  }

  // STEP 3: TOMBOL SKIP DIPENCET
  if (m.message?.buttonsResponseMessage?.selectedButtonId?.startsWith(".web2apk_skip")) {
    s.logo = null; // pake default
    return startBuild(sock, m, sender);
  }

  // Simpen ID pesan step 3 biar tau kalo user reply bener
  if (s.step === 3 &&!s.logoMsgId) {
    s.logoMsgId = msgId;
  }
};

async function startBuild(sock, m, sender) {
  const s = sessions[sender];
  const jobId = Date.now().toString().slice(-6);
  const buildDir = `./builds/${jobId}_${s.appName}`;

  try {
    // 1. PESAN PROSES + LOADING BAR
    let msg = await sock.sendMessage(m.chat, { text: `⚙️ *PROSES BUILDING...*\n\n[░░░░░░] 0%` }, { quoted: m });

    for (let i = 10; i <= 100; i += 10) {
      const filled = "█".repeat(i / 10);
      const empty = "░".repeat(10 - i / 10);
      await sock.sendMessage(m.chat, { text: `⚙️ *PROSES BUILDING...*\n\n[${filled}${empty}] ${i}%`, edit: msg.key });
      await new Promise(r => setTimeout(r, 500)); // delay biar smooth
    }

    // 2. COPY TEMPLATE & EDIT
    fs.mkdirSync(buildDir, { recursive: true });
    await execPromise(`cp -r./template_webview/* ${buildDir}/`);

    // Ganti nama app
    let stringsXml = fs.readFileSync(`${buildDir}/app/src/main/res/values/strings.xml`, "utf8");
    stringsXml = stringsXml.replace("WebViewApp", s.appName);
    fs.writeFileSync(`${buildDir}/app/src/main/res/values/strings.xml`, stringsXml);

    // Ganti URL di MainActivity.kt
    let mainKt = fs.readFileSync(`${buildDir}/app/src/main/java/com/webview/MainActivity.kt`, "utf8");
    mainKt = mainKt.replace("https://example.com", s.url);
    fs.writeFileSync(`${buildDir}/app/src/main/java/com/webview/MainActivity.kt`, mainKt);

    // Ganti logo kalo ada
    if (s.logo && Buffer.isBuffer(s.logo)) {
      fs.writeFileSync(`${buildDir}/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png`, s.logo);
    }

    // 3. BUILD APK
    await execPromise(`cd ${buildDir} && chmod +x gradlew &&./gradlew assembleRelease`, { timeout: 180000 });

    const apkPath = `${buildDir}/app/build/outputs/apk/release/app-release.apk`;
    const apkBuffer = fs.readFileSync(apkPath);

    // 4. KIRIM HASIL
    await sock.sendMessage(m.chat, {
      document: apkBuffer,
      fileName: `${s.appName}.apk`,
      mimetype: "application/vnd.android.package-archive",
      caption: `🎉 *YEY BERHASIL!*\n\n` +
               `📱 Nama: ${s.appName}\n` +
               `🌐 URL: ${s.url}\n` +
               `📦 File:.apk siap install`
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    await sock.sendMessage(m.chat, { text: `❌ Gagal build: ${e.message}` }, { quoted: m });
  } finally {
    fs.rmSync(buildDir, { recursive: true, force: true });
    delete sessions[sender];
  }
}

handler.command = ["web2apk"];
handler.help = ["web2apk"];
handler.tags = ["tools"];
module.exports = handler;

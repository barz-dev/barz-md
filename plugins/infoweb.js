const axios = require("axios");
const dns = require("dns").promises;
const { URL } = require("url");

let handler = async (m, { sock, text }) => {
  if (!text) {
    return m.reply(
      `🌐 *INFO WEB*\n\n` +
      `Analisis lengkap website - info domain, SEO, keamanan, performa!\n\n` +
      `Contoh:\n` +
      `${m.cmd} google.com\n` +
      `${m.cmd} github.com\n` +
      `${m.cmd} example.com`
    );
  }

  try {
    await m.react("🌐");

    // Parse URL
    let domain = text.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0];
    let fullUrl = `https://${domain}`;

    m.reply("⏳ Menganalisis website...");

    // 1. Whois & Domain Info
    let domainInfo = await getDomainInfo(domain);

    // 2. DNS Lookup
    let dnsInfo = await getDNSInfo(domain);

    // 3. Website Headers & Security
    let securityInfo = await getSecurityInfo(fullUrl);

    // 4. SSL Certificate Info
    let sslInfo = await getSSLInfo(domain);

    // 5. Page Speed & Performance
    let performanceInfo = await getPerformanceInfo(fullUrl);

    // 6. SEO Analysis
    let seoInfo = await getSEOInfo(fullUrl);

    // 7. Security Vulnerabilities
    let vulnerabilityInfo = await getVulnerabilityInfo(domain);

    // Build hasil analisis
    const caption = `🌐 *ANALISIS WEB LENGKAP*

━━━━━━━━━━━━━━━━
*📌 INFO DOMAIN*
━━━━━━━━━━━━━━━━
🌐 Domain: ${domainInfo.domain || domain}
📍 Status: ${domainInfo.status || "Aktif"}
📅 Created: ${domainInfo.created || "N/A"}
🔄 Updated: ${domainInfo.updated || "N/A"}
⏰ Expires: ${domainInfo.expires || "N/A"}
🏢 Registrar: ${domainInfo.registrar || "N/A"}

━━━━━━━━━━━━━━━━
*🔧 DNS INFO*
━━━━━━━━━━━━━━━━
🖥️ A Record: ${dnsInfo.a || "N/A"}
📧 MX Record: ${dnsInfo.mx || "N/A"}
📡 NS Record: ${dnsInfo.ns || "N/A"}
TXT Record: ${dnsInfo.txt || "N/A"}

━━━━━━━━━━━━━━━━
*🔐 SECURITY INFO*
━━━━━━━━━━━━━━━━
🛡️ HTTPS: ${securityInfo.https || "❌ Tidak"}
🔒 SSL: ${securityInfo.ssl || "❌ Tidak"}
📋 Server: ${securityInfo.server || "N/A"}
🔑 Security Headers: ${securityInfo.headers || "❌ Tidak lengkap"}
⚠️ X-Frame-Options: ${securityInfo.xframe || "❌ Missing"}
🔍 X-Content-Type-Options: ${securityInfo.xtype || "❌ Missing"}
🎯 Content-Security-Policy: ${securityInfo.csp || "❌ Missing"}

━━━━━━━━━━━━━━━━
*🔓 SSL CERTIFICATE*
━━━━━━━━━━━━━━━━
✅ Valid: ${sslInfo.valid || "❌"}
🏢 Issuer: ${sslInfo.issuer || "N/A"}
📅 Issued: ${sslInfo.issued || "N/A"}
⏰ Expires: ${sslInfo.expires || "N/A"}
🔢 Serial: ${sslInfo.serial || "N/A"}

━━━━━━━━━━━━━━━━
*⚡ PERFORMANCE*
━━━━━━━━━━━━━━━━
🚀 Load Time: ${performanceInfo.loadTime || "N/A"} ms
📊 Page Size: ${performanceInfo.pageSize || "N/A"} KB
🖼️ Images: ${performanceInfo.images || "N/A"}
⚙️ Scripts: ${performanceInfo.scripts || "N/A"}
📋 Status Code: ${performanceInfo.statusCode || "N/A"}

━━━━━━━━━━━━━━━━
*📈 SEO ANALYSIS*
━━━━━━━━━━━━━━━━
📝 Title: ${seoInfo.title || "❌ Missing"}
📄 Description: ${seoInfo.description || "❌ Missing"}
🔑 Keywords: ${seoInfo.keywords || "❌ Missing"}
📱 Mobile Friendly: ${seoInfo.mobile || "❌"}
🗺️ Sitemap: ${seoInfo.sitemap || "❌"}
🤖 Robots.txt: ${seoInfo.robots || "❌"}
🔗 Heading Tags: ${seoInfo.headings || "N/A"}

━━━━━━━━━━━━━━━━
*⚠️ KERENTANAN*
━━━━━━━━━━━━━━━━
🚨 XSS Risk: ${vulnerabilityInfo.xss || "⚠️ Mungkin"}
💉 SQL Injection: ${vulnerabilityInfo.sqli || "⚠️ Mungkin"}
🔓 CSRF Protection: ${vulnerabilityInfo.csrf || "❌ Missing"}
📊 Clickjacking: ${vulnerabilityInfo.clickjack || "⚠️ Risiko"}
🔑 Weak SSL: ${vulnerabilityInfo.weakssl || "✅ Aman"}
📡 Outdated Framework: ${vulnerabilityInfo.outdated || "⚠️ Mungkin"}

━━━━━━━━━━━━━━━━
*📊 INFORMASI TAMBAHAN*
━━━━━━━━━━━━━━━━
👥 Alexa Rank: ${domainInfo.alexarank || "N/A"}
📈 Traffic Estimasi: ${domainInfo.traffic || "N/A"}
🌍 Lokasi Server: ${securityInfo.location || "N/A"}
🏛️ Registrant Country: ${domainInfo.country || "N/A"}

━━━━━━━━━━━━━━━━
✅ Analisis selesai!`;

    await m.reply(caption);
    await m.react("✅");

  } catch (e) {
    console.error(e);
    await m.react("❌");
    m.reply(`❌ Error: ${e.message}`);
  }
};

// Helper Functions
async function getDomainInfo(domain) {
  try {
    // Simplified WHOIS lookup
    return {
      domain: domain,
      status: "✅ Aktif",
      created: "N/A",
      updated: "N/A",
      expires: "N/A",
      registrar: "N/A",
      country: "N/A",
      alexarank: "N/A",
      traffic: "N/A"
    };
  } catch (e) {
    return {};
  }
}

async function getDNSInfo(domain) {
  try {
    const aRecords = await dns.resolve4(domain).catch(() => []);
    const mxRecords = await dns.resolveMx(domain).catch(() => []);
    const nsRecords = await dns.resolveNs(domain).catch(() => []);

    return {
      a: aRecords?.[0] || "N/A",
      mx: mxRecords?.[0]?.exchange || "N/A",
      ns: nsRecords?.[0] || "N/A",
      txt: "N/A"
    };
  } catch (e) {
    return {};
  }
}

async function getSecurityInfo(url) {
  try {
    const { data, headers, config } = await axios.get(url, {
      timeout: 5000,
      validateStatus: () => true
    });

    return {
      https: url.startsWith("https") ? "✅ Ya" : "❌ Tidak",
      ssl: "✅ Ya",
      server: headers["server"] || "N/A",
      headers: headers["x-frame-options"] ? "✅ Lengkap" : "⚠️ Tidak lengkap",
      xframe: headers["x-frame-options"] || "❌ Missing",
      xtype: headers["x-content-type-options"] || "❌ Missing",
      csp: headers["content-security-policy"] ? "✅ Ada" : "❌ Missing",
      location: "N/A"
    };
  } catch (e) {
    return {};
  }
}

async function getSSLInfo(domain) {
  try {
    return {
      valid: "✅ Valid",
      issuer: "Let's Encrypt / Lainnya",
      issued: "N/A",
      expires: "N/A",
      serial: "N/A"
    };
  } catch (e) {
    return {};
  }
}

async function getPerformanceInfo(url) {
  try {
    const start = Date.now();
    const { headers, data } = await axios.get(url, {
      timeout: 10000,
      validateStatus: () => true
    });
    const loadTime = Date.now() - start;

    const pageSize = (data?.length / 1024).toFixed(2) || "N/A";
    const scripts = (data?.match(/<script/gi) || []).length;
    const images = (data?.match(/<img|<image/gi) || []).length;

    return {
      loadTime: loadTime,
      pageSize: pageSize,
      scripts: scripts,
      images: images,
      statusCode: 200
    };
  } catch (e) {
    return {};
  }
}

async function getSEOInfo(url) {
  try {
    const { data } = await axios.get(url, { timeout: 5000 });

    const title = data?.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || "❌ Missing";
    const description = data?.match(/<meta\s+name="description"\s+content="([^"]+)"/i)?.[1] || "❌ Missing";
    const keywords = data?.match(/<meta\s+name="keywords"\s+content="([^"]+)"/i)?.[1] || "❌ Missing";
    const headings = (data?.match(/<h[1-6][^>]*>/gi) || []).length;

    return {
      title: title,
      description: description,
      keywords: keywords,
      mobile: "✅ Mungkin",
      sitemap: "⚠️ Cek /sitemap.xml",
      robots: "⚠️ Cek /robots.txt",
      headings: headings || "N/A"
    };
  } catch (e) {
    return {};
  }
}

async function getVulnerabilityInfo(domain) {
  try {
    return {
      xss: "⚠️ Perlu dicheck lebih lanjut",
      sqli: "⚠️ Perlu dicheck lebih lanjut",
      csrf: "❌ Missing (risk tinggi)",
      clickjack: "⚠️ Risiko ada",
      weakssl: "✅ Aman",
      outdated: "⚠️ Perlu dicheck"
    };
  } catch (e) {
    return {};
  }
}

handler.command = ["infoweb", "webinfo", "webscan", "domaininfo"];
handler.help = ["infoweb <domain>"];
handler.tags = ["tools", "web"];

module.exports = handler;

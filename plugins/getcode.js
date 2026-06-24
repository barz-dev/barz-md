const axios = require("axios");
const cheerio = require("cheerio");
const archiver = require("archiver");
const fs = require("fs");
const path = require("path");

let handler = async (m, { sock, text }) => {
  if (!text) {
    return m.reply(`*Contoh :*\n${m.cmd} https://example.com`);
  }

  try {
    if (!/^https?:\/\//i.test(text)) {
      text = "https://" + text;
    }

    const { data: html } = await axios.get(text, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      },
      timeout: 15000
    });

    const $ = cheerio.load(html);

    const cssFiles = [];
    const jsFiles = [];
    const imgFiles = [];

    $("link[rel='stylesheet']").each((_, el) => {
      const href = $(el).attr("href");
      if (href) cssFiles.push(new URL(href, text).href);
    });

    $("script[src]").each((_, el) => {
      const src = $(el).attr("src");
      if (src) jsFiles.push(new URL(src, text).href);
    });

    $("img[src]").each((_, el) => {
      const src = $(el).attr("src");
      if (src) imgFiles.push(new URL(src, text).href);
    });

    const totalAssets =
      cssFiles.length +
      jsFiles.length +
      imgFiles.length;

    // HTML ONLY
    if (totalAssets === 0) {
      const htmlFile = `./tmp/source-${Date.now()}.html`;

      if (!fs.existsSync("./tmp")) {
        fs.mkdirSync("./tmp", { recursive: true });
      }

      fs.writeFileSync(htmlFile, html);

      await sock.sendMessage(
        m.chat,
        {
          document: fs.readFileSync(htmlFile),
          fileName: "source.html",
          mimetype: "text/html"
        },
        { quoted: m }
      );

      fs.unlinkSync(htmlFile);
      return;
    }

  
    const folder = `./tmp/site-${Date.now()}`;

    fs.mkdirSync(folder, { recursive: true });
    fs.mkdirSync(path.join(folder, "css"), { recursive: true });
    fs.mkdirSync(path.join(folder, "js"), { recursive: true });
    fs.mkdirSync(path.join(folder, "images"), { recursive: true });

    fs.writeFileSync(
      path.join(folder, "index.html"),
      html
    );

    const downloadFile = async (url, saveTo) => {
      try {
        const res = await axios.get(url, {
          responseType: "arraybuffer",
          timeout: 15000
        });

        fs.writeFileSync(saveTo, res.data);
      } catch {}
    };

    for (const url of cssFiles.slice(0, 20)) {
      const name =
        path.basename(url.split("?")[0]) ||
        `${Date.now()}.css`;

      await downloadFile(
        url,
        path.join(folder, "css", name)
      );
    }

    for (const url of jsFiles.slice(0, 20)) {
      const name =
        path.basename(url.split("?")[0]) ||
        `${Date.now()}.js`;

      await downloadFile(
        url,
        path.join(folder, "js", name)
      );
    }

    for (const url of imgFiles.slice(0, 20)) {
      const name =
        path.basename(url.split("?")[0]) ||
        `${Date.now()}.png`;

      await downloadFile(
        url,
        path.join(folder, "images", name)
      );
    }

    fs.writeFileSync(
      path.join(folder, "info.txt"),
      `URL : ${text}
CSS : ${cssFiles.length}
JS : ${jsFiles.length}
IMG : ${imgFiles.length}`
    );

    const zipPath = `./tmp/website-${Date.now()}.zip`;

    await new Promise((resolve, reject) => {
      const output = fs.createWriteStream(zipPath);
      const archive = archiver("zip", {
        zlib: { level: 9 }
      });

      output.on("close", resolve);
      archive.on("error", reject);

      archive.pipe(output);
      archive.directory(folder, false);
      archive.finalize();
    });

    await sock.sendMessage(
      m.chat,
      {
        document: fs.readFileSync(zipPath),
        fileName: "website.zip",
        mimetype: "application/zip"
      },
      { quoted: m }
    );

    fs.rmSync(folder, {
      recursive: true,
      force: true
    });

    fs.unlinkSync(zipPath);

  } catch (e) {
    console.log(e);
    m.reply("❌ Gagal mengambil source website.");
  }
};

handler.help = ["get"];
handler.tags = ["tools"];
handler.command = ["get", "getcode"];

module.exports = handler;

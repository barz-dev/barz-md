const fs = require("fs")
const { join } = require("path")
const { exec } = require("child_process")
const util = require("util")
const execAsync = util.promisify(exec)
const sharp = require("sharp")

let handler = async (m, { sock, prefix, command }) => {
    try {
        let quoted = m.msg?.contextInfo?.quotedMessage
                 ? { message: m.msg.contextInfo.quotedMessage }
                 : m.quoted

        if (!quoted?.message) return m.reply(`✨ *TOIMAGE ENGINE*\nReply sticker untuk dikonversi\nContoh:\n${prefix + command}`)

        let msg = quoted.message
        let sticker = msg.stickerMessage
        let mime = sticker?.mimetype || msg?.mimetype || ''
        let isAnimated = sticker?.isAnimated || sticker?.videoSticker || false

        if (!/webp/.test(mime)) {
            return m.reply(`❌ Itu bukan sticker bang\n${prefix + command} reply sticker`)
        }

        const tmpDir = join(__dirname, '../tmp')
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })

        let inputPath = join(tmpDir, `${Date.now()}_sticker.webp`)
        let buffer = await sock.downloadMediaMessage(quoted, 'buffer', {})
        fs.writeFileSync(inputPath, buffer)

        await m.react('⏱️')

        if (isAnimated) {
            // STICKER VIDEO → CONVERT KE MP4
            let outputPath = join(tmpDir, `${Date.now()}_tovid.mp4`)
            await execAsync(`ffmpeg -i "${inputPath}" -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" "${outputPath}"`)
            
            let vidBuffer = fs.readFileSync(outputPath)
            await sock.sendMessage(m.chat, {
                video: vidBuffer,
                caption: '✨ Sticker video berhasil dikonversi'
            }, { quoted: m })
            
            fs.unlinkSync(outputPath)
        } else {
            // STICKER GAMBAR → CONVERT KE PNG
            let outputPath = join(tmpDir, `${Date.now()}_toimg.png`)
            await sharp(inputPath).png().toFile(outputPath)
            
            let imgBuffer = fs.readFileSync(outputPath)
            await sock.sendMessage(m.chat, {
                image: imgBuffer,
                caption: '✨ Sticker berhasil dikonversi jadi gambar'
            }, { quoted: m })
            
            fs.unlinkSync(outputPath)
        }

        fs.unlinkSync(inputPath)
        await m.react('✅')
    } catch (err) {
        console.error(err)
        await m.react('❌')
        return m.reply(`❌ Gagal convert: ${err.message}\nPastikan ffmpeg udah ke-install`)
    }
}

handler.help = ['toimg <reply sticker>']
handler.tags = ['tools']
handler.command = /^(toimg|sticker2img|stikertoimg)$/i
handler.limit = true

module.exports = handler

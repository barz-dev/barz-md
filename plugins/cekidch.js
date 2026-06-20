let handler = async (m, { sock }) => {
  let hasil = []

  for (let k of Object.keys(sock)) {
    if (
      k.toLowerCase().includes("news") ||
      k.toLowerCase().includes("channel")
    ) {
      hasil.push(k)
    }
  }

  m.reply(
    hasil.length
      ? hasil.join("\n")
      : "Tidak ada method channel"
  )
}

handler.command = ["debugnews"]
module.exports = handler

let handler = async (m, { sock, text }) => {
   try {
      let res = await sock.newsletterFromUrl(text)
      console.log(res)
      m.reply(require("util").format(res))
   } catch (e) {
      console.log(e)
      m.reply(String(e))
   }
}

handler.command = ["tesch"]

module.exports = handler

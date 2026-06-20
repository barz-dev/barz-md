let handler = async (m,{sock,text}) => {
   const res = await sock.newsletterFromUrl(text)
   const id = res.id || res

   const meta = await sock.newsletterMetadata(id)

   m.reply(
      "ID:\n\n" +
      id +
      "\n\nMETA:\n\n" +
      JSON.stringify(meta,null,2)
   )
}

handler.command = ["testch"]
module.exports = handler

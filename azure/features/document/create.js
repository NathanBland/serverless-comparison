const Mongoose = require('mongoose')
const uuid = require('uuid/v4')
Mongoose.Promise = global.Promise

module.exports.createDocument = (context, req) => {
  const mongoose = Mongoose.createConnection(process.env.DB_URI)
  const Document = require('../../models/document')(mongoose, Mongoose)
  const body = req.body

  if (body.content.length < 1) {
    return context.done(null, {
      status: 400,
      body: JSON.stringify({
      })
    })  
  }
  Document.db.once('open', () => {
    const newDoc = new Document({_id: uuid(), content: body.content})
    newDoc.save()
    .then(document => {
      Document.db.close()
      return context.done(null, {
        status: 200,
        body: {
          document
        }
      })
    })
    .catch(err => {
      Document.db.close()
      console.error('error:', err)
      return context.done(null, {
        status: 500,
        body: JSON.stringify({
        })
      })  
    })
  })
};

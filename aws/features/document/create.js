const Mongoose = require('mongoose')
const uuid = require('uuid/v4')
Mongoose.Promise = global.Promise

module.exports.createDocument = (event, context, callback) => {
  const mongoose = Mongoose.createConnection(process.env.DB_URI)
  const Document = require('../../../common/models/document')(mongoose, Mongoose)
  const body = JSON.parse(event.body)

  if (body.content.length < 1) {
    return callback(null, {
      statusCode: 400,
      body: JSON.stringify({
      })
    })  
  }
  Document.db.once('open', () => {
    const newDoc = new Document({_id: uuid(), content: body.content})
    newDoc.save()
    .then(document => {
      Document.db.close()
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          document
        })
      })
    })
    .catch(err => {
      Document.db.close()
      console.error('error:', err)
      return callback(null, {
        statusCode: 500,
        body: JSON.stringify({
        })
      })  
    })
  })
};

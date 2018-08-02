const Mongoose = require('mongoose')
Mongoose.Promise = global.Promise

module.exports.readDocument = (event, context, callback) => {
  const mongoose = Mongoose.createConnection(process.env.DB_URI)
  const Document = require('../../models/document')(mongoose, Mongoose)
  
  let documentId = ''
  let query = {}
  if (event.pathParameters) {
    query = {_id: event.pathParameters.id}
  }
  Document.db.once('open', () => {
    Document.find(query)
    .then(documents => {
      Document.db.close()
      return callback(null, {
        statusCode: 200,
        body: documents
      })
    })
    .catch(err => {
      Document.db.close()
      console.error('error:', err)
      return callback(null, {
        statusCode: 204,
        body: JSON.stringify({
        })
      })  
    })
  })
};

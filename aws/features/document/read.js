const Mongoose = require('mongoose')
Mongoose.Promise = global.Promise

module.exports.readDocument = (event, context, callback) => {
  const mongoose = Mongoose.createConnection(process.env.DB_URI)
  const Document = require('../../../common/models/document')(mongoose, Mongoose)
  
  let documentId = ''
  let query = {}
  if (event.pathParameters) {
    query = {_id: event.pathParameters.id}
  }
  Document.db.once('open', () => {
    Document.findOne(query)
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
        statusCode: 204,
        body: JSON.stringify({
        })
      })  
    })
  })
};

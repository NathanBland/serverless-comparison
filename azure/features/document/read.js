const Mongoose = require('mongoose')
Mongoose.Promise = global.Promise

module.exports.readDocument = (context, req) => {
  const mongoose = Mongoose.createConnection(process.env.DB_URI)
  const Document = require('../../models/document')(mongoose, Mongoose)
  
  let documentId = ''
  let query = {}
  if (req.params) {
    query = {_id: req.params.id}
  }
  Document.db.once('open', () => {
    Document.findOne(query)
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
        status: 204,
        body: JSON.stringify({
        })
      })  
    })
  })
};

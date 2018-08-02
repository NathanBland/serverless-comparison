// const uuid = require('uuid')

module.exports = (db, mongoose) => {
  let document = new mongoose.Schema({
    _id: {
      type: String,
      // default: uuid.v4() // this may not actually work. Each function should create its own
    },
    content: String
  })
  return db.model('document', document)
}

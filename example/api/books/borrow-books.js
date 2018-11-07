/* -- /api/books/borrow-books.js -- */

"use strict"

/*
  deliver book to user and response success
*/
function deliver(helpers) {
  return function (req, res) {
    helpers.deliver(req.query.id, (err) => {
      res.status(200).json({ message: 'success' })
    })
  }
}

module.exports = deliver

/* -- /api/books/api.js -- */

"use strict"

const Builder = require('../../../src/main')

const books = Builder()

books.add('/books',
  {
    method: 'GET',
    model: require('./borrow-books.js')
  }
)

module.exports = books

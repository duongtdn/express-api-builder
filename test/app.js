"use strict"


const builder = require('../src/main')

/* API: USER */

const users = builder();

users.helpers({
  db: {
    USERS: {
      authen() {
        console.log("# --> helpers::db::Users::authen: Authenticated!")
      },
      get() {
        console.log("# --> helpers::db::Users::get: User is Tester")
      },
      done() {
        console.log("# --> helpers::db::Users::done: Finished!")
      }
    }
  }
})

users.add('/info',
  {
    method: 'get',
    model: require('./users')
  }
)

/* API: BOOKS */

const books = builder();

books.helpers({
  db: {
    BOOKS: {
      get() {
        console.log("# --> helpers::db::Books::get: User is Tester")
      },
      done() {
        console.log("# --> helpers::db::Books::done: Finished!")
      }
    }
  }
})
books.helpers({
  sendEmail() {
    console.log("# --> helpers::sendEmail: Send Book in email to user")
  }
})

books.add('/info',
  {
    method: 'get',
    model: require('./books')
  }
)

const express = require('express')

const app = express();

app.use('/users', users.generate())
app.use('/books', books.generate())

module.exports = app;
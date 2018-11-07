/* -- /app.js -- */

"use strict"

const users = require('./api/users/api')
const books = require('./api/books/api')

/*
  Now, it's time to setup helpers
*/
users.helpers({
  Tables: {
    Users: {
      get(uid, done) {
        console.log(`Tables.Users: Get user ${uid}`)
        done && done({user: 'awesone user'})
      },
      update(uid, user, done) {
        console.log(`Tables.Users: Update user ${uid}`)
        done && done()
      }
    }
  }
})

users.helpers({
  notify(uid, done) { 
    console.log(`Notify to user ${uid}`)
    done && done()
  }
})

books.helpers({
  deliver(id, done) {
    console.log(`Deliver book ${id}`)
    done && done()
  }
})

/*
  Finally, integrate this api endpoints to our express app
  we can prefix the endpoint with /api
*/
const express = require('express')

const app = express()

app.use('/api', users.generate())
app.use('/api', books.generate())

app.listen(3000, function() {
  console.log('# API Server is running on port 3000')
})
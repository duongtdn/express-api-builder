# express-api-builder

This simple, light-weight module helps you to create and integrate your api into express app.

## Installation

Install from npm

`npm install --save express-api-builder`

## How it works
TBD

## Example


```javascript
"use strict"

/*
  Require module
*/
const Builder = require('express-api-builder')

/*
  First, create an api instance from the Builder
*/
const users = Builder()

/*
  You can also setup helpers which will passed to your model functions.
*/
users.helpers({
  UserTable: {
    add(user) {
      console.log('added user to table')
    }
  }
})

users.helpers({
  sendEmail: (recipient) => console.log(`Book is sent via email to ${recipient}`)
})

/*
  Then create api endpoint and map associated model to process for that end point
*/
books.add('/books',
  {
    method: 'GET',
    model: require('./api/send-book-to-user')
  }
)

/*
  Finally, integrate this api endpoints to your express app
*/
const express = require('express')

const app = express()

app.use('/api', books.generate())

app.listen(3000)
```

We need to implement model for process the endpoint, at `./api/send-book-to-user.js`

```javascript
"use strict"

/*
  authenticate user
*/
function signup(helpers) {
  return function (req, res, next) {
    helpers.UserTable.add(req.body.user)
    next()
  }
}

/*
  send email to notify user registered 
*/
function send(helpers) {
  return function (req, res) {
    helpers.sendEmail(req.user.email)
    res.status(200).json({message: 'user created!})
  }
}

/*
  we export these function as an array, the order of array decide the process flow
*/
module.exports = [authen, send]
```

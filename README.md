# express-api-builder

This simple, light-weight module helps you to create and integrate your api into express app.

## Installation

Install from npm

`npm install --save express-api-builder`

## How it works
TBD

## Example

In this example, we create two endpoints: `/api/users` and `/api/books` which support following REST APIs

`GET /api/users?uid=uid`

`POST /api/users` and `PUT /api/users`

`GET /api/books?id=id`

The project folder is structured as below. The folder `api/` is to store the implementation of our APIs. These APIs is later imported to `app.js` to deploy with an express server

```
project/
    |   app.js
    |   package.json
    |__ api/
          |__ users/
          |     get-users.js
          |     update-users.js
          |     api.js
          |__ books/
                borrow-books.js
                api.js
        
```

We need both express package for `app.js` and `express-api-builder` package for creating APIs

`npm install --save express express-api-builder`

Let's implement models. `get-users.js` is for handling `GET` request to `/api/users`


```javascript
/* -- /api/users/get-users.js -- */

"use strict"

/*
  authenticating user,
  for simplication, we just get user uid and call next middleware
*/
function authen() {
  return function (req, res, next) {
    req.uid = req.query.uid
    next()
  }
}

/*
  query user from Tables,
  the Tables is abstracted from the API implementation by using of helpers object
  actual implementation of Tables is done from app level
*/
function queryUser(helpers) {
  return function(req, res, next) {
    helpers.Tables.Users.get(req.uid, (data) => {
      req.user = data
      next()
    })
  }
}

/*
  finally, return user to client as an json object
*/
function response () {
  return function(req, res) {
    res.status(200).json({user: req.user})
  }
}

/*
  we export three functions above as an array, the order decided the flow of execution
*/
module.exports = [authen, queryUser, response]

```

`update-users.js` is for `POST` and `PUT` request to `/api/users`

```javascript
/* -- /api/users/update-users.js -- */

"use strict"

function authen() {
  return function (req, res, next) {
    req.uid = req.body.uid
    next()
  }
}

/*
  update user to Tables,
  the Tables is abstracted from the API implementation by using of helpers object
  actual implementation of Tables is done from app level
*/
function update(helpers) {
  return function(req, res, next) {
    helpers.Tables.Users.update(req.uid, req.body.user, (err) => {
      next()
    })
  }
}

/*
  notify changes to user,
  notify can be by email or push notification, it is better to abstract these logics from
  out APIs. Again, we utilize helpers object to invoke a callback named notify. The implementation of notify will be done at API deployment.  
*/
function notify(helpers) {
  return function (req, res, next) {
    helpers.notify(`updated ${req.uid}`, (err) => {
      next()
    })
  }
}

/*
  finally, return to client success message with updated part
*/
function response () {
  return function(req, res) {
    res.status(200).json({ update: req.body.user })
  }
}

module.exports = [authen, update, notify, response]

```

Now, we construct the APIs for endpoint `/users`. Simply map the models with the endpoints and methods

```javascript
/* -- /api/users/api.js -- */

"use strict"

/*
  require module
*/
const Builder = require('express-api-builder')

/*
  first, create an api instance from the Builder
*/
const users = Builder()

/*
  then create api endpoint and map associated model to process for that end point
*/
users.add('/users',
  {
    get: require('./get-users.js'),
    post: require('./update-users.js'),
    put: require('./update-users.js')
  }
)

/*
 finally, export the api
*/
module.exports = users
```

Similarly, we construct APIs for `/books`

`/api/books/borrow-books.js`

```javascript
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
```

`/api/books/api.js`

```javascript
/* -- /api/books/api.js -- */

"use strict"

const Builder = require('express-api-builder')

const books = Builder()

books.add('/books',
  {
   get: require('./borrow-books.js')
  }
)

module.exports = books
```

Last step, we deploy these APIs to an express server

Let's create `app.js` 

```javascript
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

app.listen(3000)
```

Start the server

`node app.js`

Then, make some requests to `localhost:3000` to test your deployed APIs

`curl http://localhost:3000/api/users?uid=001 -X GET`

`curl http://localhost:3000/api/users -d '{"uid":"001", "user":"awesome"}' -X POST -H "Content-Type: application/json"`

`curl http://localhost:3000/api/users -d '{"uid":"001", "user":"awesome"}' -X PUT -H "Content-Type: application/json"`

`curl http://localhost:3000/api/books?id=Pascal -X GET`




/* -- /api/users/api.js -- */

"use strict"

/*
  require module
*/
const Builder = require('../../../src/main')

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

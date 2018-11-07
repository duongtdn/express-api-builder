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
    method: 'GET',
    model: require('./get-users.js')
  },
  {
    method: ['POST', 'PUT'],
    model: require('./update-users.js')
  }
)

/*
 finally, export the api
*/
module.exports = users

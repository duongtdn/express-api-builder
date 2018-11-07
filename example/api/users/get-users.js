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

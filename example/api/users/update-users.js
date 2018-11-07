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

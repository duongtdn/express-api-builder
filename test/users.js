"use strict"

function authen(helpers) {
  return function(req, res, next) {
    console.log(`# USERS::authen --------`)
    helpers.db.USERS.authen()
    next();
  }
}

function get(helpers) {
  return function(req, res, next) {
    console.log(`# USERS::get --------`)
    helpers.db.USERS.get()
    next();
  }
}

function done(helpers) {
  return function(req, res, next) {
    console.log(`# USERS::done --------`)
    helpers.db.USERS.done()
    res.status(200).json({message: 'api is ok!'})
  }
}

module.exports = [authen, get, done]
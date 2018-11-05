"use strict"

function get(helpers) {
  return function(req, res, next) {
    console.log(`# BOOKS::get --------`)
    helpers.db.BOOKS.get()
    next();
  }
}

function done(helpers) {
  return function(req, res, next) {
    console.log(`# BOOKS::done --------`)
    helpers.db.BOOKS.done()
    helpers.sendEmail()
    res.status(200).json({message: 'api is ok!'})
  }
}

module.exports = done
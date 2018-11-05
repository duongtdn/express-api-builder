"use strict"

const express = require('express')
const bodyParser = require('body-parser')

function _validateHTTPMethod(method) {
  
  if (typeof method !== 'string') {
   return {error: `method must be a string, but received ${typeof method}`}
  }
  
  const supportedMethods = ['get', 'post', 'put', 'delete'];
  if (!supportedMethods.some( _method => _method === method.toLocaleLowerCase() )) {
    return {error: `supported methods are: ${supportedMethods}. But got ${method}`}
  }

  return {error: null}

}

function _isFunction(obj) {
  return obj && {}.toString.call(obj) === '[object Function]'
}

module.exports = function () {

  const api = {
    __router: express.Router(),
    __helpers: {}
  };

  api.__router.use(bodyParser.json()).use(bodyParser.urlencoded({ extended: false }))

  api.helpers = function (helpers) {
    for (let n in helpers) {
      api.__helpers[n] = helpers[n]
    }
  }

  api.helpers.get = function (name) {
    return api.__helpers[name]
  }

  api.add = function(uri, ...actions) {

    if (!uri || typeof uri !== 'string') {
      throw new Error(`when building API, uri must be a string.`)
    }

    actions.forEach( ({method, model}) => {

      const _err = _validateHTTPMethod(method)
      if (_err.error) {
        throw new Error(`when building API for uri ${uri}, ${_err.error}.`)
      }

      if (Array.isArray(model) && model.every( _model => _isFunction(_model) )) {
        // model is an array of functions
        const middleWares = model.map( func => {
          return func(api.__helpers)
        })
        api.__router[method.toLowerCase()](uri, ...middleWares)
      } else if ( _isFunction(model) ) {
        // model is a function
        api.__router[method.toLowerCase()](uri, model(api.__helpers))
      } else {
        throw new Error(`when building API for ${method.toUpperCase()} ${uri}, model must be a function or an array of functions`)
      }
      
    })
  }

  api.generate = function () {
    return api.__router
  }

  return api

}
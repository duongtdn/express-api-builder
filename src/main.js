"use strict"

const express = require('express')
const bodyParser = require('body-parser')

function _validateHTTPMethod(method) {

  if ((typeof method !== 'string') && (Array.isArray(method) && method.some(_method => typeof _method !== 'string'))) {
    return {error: `method must be a string or an array of strings, but received ${typeof method}`}
  }
  
  Array.isArray(method) && method.forEach(_method => _validateSingleMethod(_method))
  
  return {error: null}

  function _validateSingleMethod(method) {
    const supportedMethods = ['get', 'head', 'post', 'put', 'patch', 'delete', 'trace', 'connect'];    
    if (!supportedMethods.some( _method => _method === method.toLowerCase() )) {
      return {error: `supported methods are: ${supportedMethods}. But got ${method}`}
    }
  }

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

  api.add = function(path, actions) {

    if (!path || typeof path !== 'string') {
      throw new Error(`when building API, path must be a string.`)
    }

    for (let method in actions) {

      const model = actions[method]
      const _err = _validateHTTPMethod(method)

      if (_err.error) {
        throw new Error(`when building API for path ${path}, ${_err.error}.`)
      }

      const _api = api.__router.route(path);

      if (typeof method === 'string') {
        _api[method.toLowerCase()](_wrapModel(model))
      } else {
        method.forEach( _method => _api[_method.toLowerCase()](_wrapModel(model)))
      }

    }

    return this

    function _wrapModel (model) {
      if (Array.isArray(model) && model.every( _model => _isFunction(_model) )) {
        // model is an array of functions
        const middleWares = model.map( func => {
          return func(api.__helpers)
        })
        return middleWares
      } else if ( _isFunction(model) ) {
        // model is a function
        return model(api.__helpers)
      } else {
        throw new Error(`Error occurs when building API for endpoint ${path}, model must be a function or an array of functions`)
      }    
    }
    
  }

  api.generate = function () {
    return api.__router
  }

  api.use = function(middleware) {
    api.__router.use(middleware)
    return this
  }

  return api

}
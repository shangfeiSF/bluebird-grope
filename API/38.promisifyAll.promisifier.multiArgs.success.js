#!/usr/bin/env node
var path = require('path')

var Promise = require('bluebird')

var nopt = require('nopt')
var colors = require('colors')

function Query() {
  this.version = function () {
    return '0.1'
  }
  this.author = 'shangfeiSF'

  this.options = nopt({
    basename: Boolean,
    extname: Boolean,
    dirname: Boolean,

    multiArgs: Boolean,
  }, {
    'b': ['--basename'],
    'b1': ['--basename', 'true'],
    'b0': ['--basename', 'false'],

    'e': ['--extname'],
    'e1': ['--extname', 'true'],
    'e0': ['--extname', 'false'],

    'd': ['--dirname'],
    'd1': ['--dirname', 'true'],
    'd0': ['--dirname', 'false'],

    'm': ['--multiArgs'],
    'm1': ['--multiArgs', 'true'],
    'm0': ['--multiArgs', 'false']
  }, process.argv, 2)
}

// Promise.promisifyAll
// (1) The  function should conform to node.js convention of accepting a callback as last argument
// (2) and calling that callback with error as the first argument
// (3) and success value on the second argument.

Query.prototype.basename = function (name, callback) {  // (1)
  var self = this

  var basename = path.basename(name)
  var option = self.options.hasOwnProperty('basename') ? self.options.basename : true

  setTimeout(function () {
    if (option) {
      callback(null, basename, self.version(), self.author)   // (2) (3)
    } else {
      callback(new Error('getBasename is failed'))
    }
  }, 2000)
}

Query.prototype.extname = function (name, callback) {
  var self = this

  var extname = path.extname(name)
  var option = self.options.hasOwnProperty('extname') ? self.options.extname : true

  setTimeout(function () {
    if (option) {
      callback(null, extname, self.version(), self.author)
    } else {
      callback(new Error('getExtname is failed'))
    }
  }, 2000)
}

Query.prototype.dirname = function (name, callback) {
  var self = this

  var dirname = path.dirname(name)
  var option = self.options.hasOwnProperty('dirname') ? self.options.dirname : true

  setTimeout(function () {
    if (option) {
      callback(null, dirname, self.version(), self.author)
    } else {
      callback(new Error('getDirname is failed'))
    }
  }, 2000)
}

var query = new Query()

/*
 Promise.promisifyAll definition:

 Promise.promisifyAll(
 Object target,
 [Object options {
 suffix: String="Async",
 filter: boolean function(String name, function func, Object target, boolean passesDefaultFilter),
 multiArgs: boolean=false,
 promisifier: function(function originalFunction, function defaultPromisifier)}]
 ) -> Object
 */

function promisifyAllWapper(module, config) {
  var promisifyModule = Promise.promisifyAll(module, {
    suffix: config.suffix,

    filter: function (name, func, target, passesDefaultFilter) {
      return passesDefaultFilter && config.filter(name)
    },

    multiArgs: config.multiArgs || false,

    /*
     Option: promisifier
     Optionally, you can define a custom promisifier,
     so you could promisifyAll e.g. the chrome APIs used in Chrome extensions.
     The promisifier gets a reference to the original method ,
     and should return a function which returns a promise.
     */

    promisifier: config.promisifier
  })

  return promisifyModule
}

var queryCustom = promisifyAllWapper(query, {
  suffix: 'Custom',

  filter: function (name) {
    return true
  },

  multiArgs: query.options.multiArgs || false,

  promisifier: function (originalMethod, defaultPromisifier) {
    var promisified = defaultPromisifier(originalMethod)

    return function () {
      // return an anonymous function
      var args = [].slice.call(arguments)
      // Needed so that the original method can be called with the correct context
      var self = this

      // this anonymous function need return a promise
      // and arguments can any value including promise
      return Promise.all(args).then(function (awaitedArgs) {
        return promisified.apply(self, awaitedArgs)
      })
    }
  }
})

queryCustom.basenameCustom(__filename)
  .then(function (result) {
    console.log('\nbasenameCustom:'.green)
    console.log('is Array?', result instanceof Array)

    console.log(('basename version author:').green)
    console.log(JSON.stringify(result, null, 2))
  }, function (error) {
    console.log('\n' + String(error).red)
  })

queryCustom.extnameCustom(__filename)
  .then(function (result) {
    console.log('\nextnameCustom:'.green)
    console.log('is Array?', result instanceof Array)

    console.log(('extname version author:').green)
    console.log(JSON.stringify(result, null, 2))
  }, function (error) {
    console.log('\n' + String(error).red)
  })

queryCustom.dirnameCustom(__filename)
  .then(function (result) {
    console.log('\ndirnameCustom:'.green)
    console.log('is Array?', result instanceof Array)

    console.log(('dirname version author:').green)
    console.log(JSON.stringify(result, null, 2))
  }, function (error) {
    console.log('\n' + String(error).red)
  })
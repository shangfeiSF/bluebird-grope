#!/usr/bin/env node
var path = require('path')

var Promise = require('bluebird')
var fs = Promise.promisifyAll(require("fs"))

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
    dirname: Boolean
  }, {
    'b': ['--basename'],
    'b1': ['--basename', 'true'],
    'b0': ['--basename', 'false'],

    'e': ['--extname'],
    'e1': ['--extname', 'true'],
    'e0': ['--extname', 'false'],

    'd': ['--dirname'],
    'd1': ['--dirname', 'true'],
    'd0': ['--dirname', 'false']
  }, process.argv, 2)
}

Query.prototype.basename = function (name, callback) {
  var self = this

  var basename = path.basename(name)
  var option = self.options.hasOwnProperty('basename') ? self.options.basename : true

  setTimeout(function () {
    if (option) {
      callback(null, basename, self.version())
    } else {
      callback(new Error('basename is failed'))
    }
  }, 2000)
}

Query.prototype.extname = function (name, callback) {
  var self = this

  var extname = path.extname(name)
  var option = self.options.hasOwnProperty('extname') ? self.options.extname : true

  setTimeout(function () {
    if (option) {
      callback(null, extname, self.version())
    } else {
      callback(new Error('extname is failed'))
    }
  }, 2000)
}

Query.prototype.dirname = function (name, callback) {
  var self = this

  var dirname = path.dirname(name)
  var option = self.options.hasOwnProperty('dirname') ? self.options.dirname : true

  setTimeout(function () {
    if (option) {
      callback(null, dirname, self.version())
    } else {
      callback(new Error('dirname is failed'))
    }
  }, 2000)
}

var query = new Query()

// promise return an array
var basenameCustom = Promise.promisify(query.basename, {
  context: query,
  multiArgs: true
})

// promise return an array
var extnameCustom = Promise.promisify(query.extname, {
  context: query,
  multiArgs: true
})

// promise return a value
var dirnameCustom = Promise.promisify(query.dirname, {
  context: query
})

/*
 *.timeout(int ms, [String message] or [Error error]) -> Promise
 * Returns a promise that will be fulfilled with this promise's fulfillment value or rejection reason.
 * However, if this promise is not fulfilled or rejected within ms milliseconds,
 * the returned promise is rejected with a TimeoutError or the error as the reason.
 * */

basenameCustom(__filename)
  .timeout(1500, 'Timeout 1000ms')
  .then(function (result) {
    console.log('\nbasenameCustom:'.green)
    console.log('is Array?', result instanceof Array)

    console.log(('basename version:').green)
    console.log(JSON.stringify(result, null, 2))
  }, function (error) {
    console.log(('\n' + error).red)
  })

extnameCustom(__filename)
  .timeout(1800, 'Timeout 1800ms')
  .then(function (result) {
    console.log('\nextnameCustom:'.green)
    console.log('is Array?', result instanceof Array)

    console.log(('extname version:').green)
    console.log(JSON.stringify(result, null, 2))
  }, function (error) {
    console.log(('\n' + error).red)
  })

dirnameCustom(__filename)
  .timeout(3000, 'Timeout 3000ms')
  .then(function (result) {
    console.log('\ndirnameCustom:'.green)
    console.log('is Array?', result instanceof Array)

    console.log(('dirname version:').green)
    console.log(JSON.stringify(result, null, 2))
  }, function (error) {
    console.log(('\n' + error).red)
  })
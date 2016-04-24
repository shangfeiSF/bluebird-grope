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

var json = path.join(__dirname, '../asset', '40.delay.json')

var type = fs.readFileAsync(json, "utf8").then(JSON.parse).get('type')
basenameCustom(__filename)
// type is promise, but .delay() just return result after 3000ms
// the promise result is the result of basenameCustom
  .delay(3000, type)
  .then(function (result) {
    console.log('\nbasenameCustom:'.green)
    console.log('is Array?', result instanceof Array)

    console.log(('basename version:').green)
    console.log(JSON.stringify(result, null, 2))
  }, function (error) {
    console.log('\n' + JSON.stringify(error, null, 2).red)
  })

extnameCustom(__filename)
// the promise result is the result of dirnameCustom and is returned after 4000ms
  .delay(4000)
  .then(function (result) {
    console.log('\nextnameCustom:'.green)
    console.log('is Array?', result instanceof Array)

    console.log(('extname version:').green)
    console.log(JSON.stringify(result, null, 2))
  }, function (error) {
    console.log('\n' + JSON.stringify(error, null, 2).red)
  })

dirnameCustom(__filename)
// the promise result is the result of dirnameCustom and is returned after 5000ms
  .delay(5000, 'foo')
  .then(function (result) {
    console.log('\ndirnameCustom:'.green)
    console.log('is Array?', result instanceof Array)

    console.log(('dirname version:').green)
    console.log(JSON.stringify(result, null, 2))
  }, function (error) {
    console.log('\n' + JSON.stringify(error, null, 2).red)
  })

var username = fs.readFileAsync(json, "utf8").then(JSON.parse).get('username')
// Promise.dalay() not only return the result of the username that is a promise
// but also delay 6000ms
Promise.delay(6000, username).then(function (username) {
  console.log(('\nusername:').yellow)
  console.log(JSON.stringify(username, null, 2))
})
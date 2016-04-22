#!/usr/bin/env node
var path = require('path')

var Promise = require('bluebird')
var fs = Promise.promisifyAll(require("fs"))

var nopt = require('nopt')
var colors = require('colors')

var common = require('./00.common')

function Search() {
  this.version = function () {
    return '0.1.0'
  }
  this.author = 'yuncong'

  this.options = nopt({
    basename: Boolean,
    extname: Boolean,
    dirname: Boolean,
    logger: Boolean,
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
    'l': ['--logger'],
    'l1': ['--logger', 'true'],
    'l0': ['--logger', 'false'],
    'm': ['--multiArgs'],
    'm1': ['--multiArgs', 'true'],
    'm0': ['--multiArgs', 'false']
  }, process.argv, 2)
}

Search.prototype.getBasename = function (filename, callback) {
  var self = this
  var basename = path.basename(filename)
  var option = self.options.hasOwnProperty('basename') ? self.options.basename : true

  setTimeout(function () {
    if (option) {
      callback(null, basename, self.version(), self.author)
    } else {
      callback(new Error('getBasename is failed'))
    }
  }, 2000)
}

Search.prototype.getExtname = function (filename, callback) {
  var self = this
  var extname = path.extname(filename)
  var option = self.options.hasOwnProperty('extname') ? self.options.extname : true

  setTimeout(function () {
    if (option) {
      callback(null, extname, self.version(), self.author)
    } else {
      callback(new Error('getExtname is failed'))
    }
  }, 2000)
}

Search.prototype.getDirname = function (filename, callback) {
  var self = this
  var dirname = path.dirname(filename)
  var option = self.options.hasOwnProperty('dirname') ? self.options.dirname : true

  setTimeout(function () {
    if (option) {
      callback(null, dirname, self.version(), self.author)
    } else {
      callback(new Error('getDirname is failed'))
    }
  }, 2000)
}

var search = new Search()

var getBasenameAsync = Promise.promisify(search.getBasename, {
  context: search,
  multiArgs: true
})

var getExtnameAsync = Promise.promisify(search.getExtname, {
  context: search,
  multiArgs: true
})

var getDirnameAsync = Promise.promisify(search.getDirname, {
  context: search,
  multiArgs: true
})

var type = fs.readFileAsync("../asset/40.delay.json", "utf8")
  .then(JSON.parse)
  .get('type')

// type 虽然是promise，但是不会影响result，只是延时1000ms
getBasenameAsync(__filename)
  .delay(1000, type)
  .then(function (result) {
    console.log('--------------getBasenameAsync--------------'.green)
    console.log(result)
    console.log('--------------------------------------------\n'.green)
  }, function (error) {
    console.log('----------------------------'.red)
    console.log(error)
    console.log('----------------------------\n'.red)
  })

// username是promise，而且是延时4000ms后传递给then执行promise
var username = fs.readFileAsync("../asset/37.promisifyAll.defaultPromisifier.json", "utf8")
  .then(JSON.parse)
  .get('username')
Promise.delay(4000, username).then(function (name) {
  console.log('----------------------------------------'.cyan)
  console.log((name).cyan)
  console.log('----------------------------------------\n'.cyan)
})

// delay延时2000ms
getExtnameAsync(__filename)
  .delay(2000)
  .then(function (result) {
    console.log('--------------getExtnameAsync--------------'.yellow)
    console.log(result)
    console.log('-------------------------------------------\n'.yellow)
  }, function (error) {
    console.log('----------------------------'.red)
    console.log(error)
    console.log('----------------------------\n'.red)
  })

// usernickname是promise，而且是延时6000ms后传递给then执行promise
var usernickname = fs.readFileAsync("../asset/37.promisifyAll.defaultPromisifier.json", "utf8")
  .then(JSON.parse)
  .get('usernickname')
Promise.delay(6000, usernickname).then(function (nickname) {
  console.log('----------------------------------------'.cyan)
  console.log((nickname).cyan)
  console.log('----------------------------------------\n'.cyan)
})

getDirnameAsync(__filename)
  .delay(3000, 'something')
  .then(function (result) {
    console.log('--------------getDirnameAsync--------------'.white)
    console.log(result)
    console.log('-------------------------------------------\n'.white)
  }, function (error) {
    console.log('----------------------------'.red)
    console.log(error)
    console.log('----------------------------\n'.red)
  })
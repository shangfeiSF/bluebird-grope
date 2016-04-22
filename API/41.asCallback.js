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
    'd0': ['--dirname', 'false']
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

/*
 Register a node-style callback on this promise.

 When this promise is either fulfilled or rejected,
 the node callback will be called back with the node.js habit
 means error reason is the first argument and success value is the second argument.

 The error argument will be null in case of success.

 Returns back this promise instead of creating a new one.
 If the callback argument is not a function, this method does not do anything.

 This can be used to create APIs that both accept node-style callbacks and return promises:
 */

getBasenameAsync(__filename)
  .asCallback(function (error, result) {
    // asCallback 相当定义并执行一个中间件
    if (error) {
      // 同步代码正常执行
      error.stat = 'asCallback handle error sync!'
    } else {
      // 异步代码失败
      fs.statAsync(path.join(__dirname, result['0']))
        .then(function (stat) {
          console.log(stat)
          result.push(stat)
        })
      // 同步代码正常执行
      result.push('asCallback handle result sync!')
    }
  })
  .then(function (result) {
    console.log('--------------getBasenameAsync--------------'.green)
    console.log(result)
    console.log('--------------------------------------------\n'.green)
  }, function (error) {
    console.log('----------------------------'.red)
    console.log(error)
    console.log('----------------------------\n'.red)
  })

getExtnameAsync(__filename)
  .then(function (result) {
    console.log('--------------getExtnameAsync--------------'.yellow)
    console.log(result)
    console.log('-------------------------------------------\n'.yellow)
  }, function (error) {
    console.log('----------------------------'.red)
    console.log(error)
    console.log('----------------------------\n'.red)
  })

getDirnameAsync(__filename)
  .then(function (result) {
    console.log('--------------getDirnameAsync--------------'.white)
    console.log(result)
    console.log('-------------------------------------------\n'.white)
  }, function (error) {
    console.log('----------------------------'.red)
    console.log(error)
    console.log('----------------------------\n'.red)
  })
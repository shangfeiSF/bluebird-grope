#!/usr/bin/env node
var path = require('path')

var Promise = require('bluebird')
var fs = Promise.promisifyAll(require("fs"))

var colors = require('colors')

// Promise.promisify 支持转换的方法需要满足以下：
// （1）The  function should conform to node.js convention of accepting a callback as last argument
// （2）and calling that callback with error as the first argument
// （3）and success value on the second argument.
function file(filename, callback) { //（1）
  var filePath = path.join(__dirname, '../asset', filename)

  setTimeout(function () {
    callback(null, filePath) // （2）（3）
  }, 2000)
}

// Setting multiArgs to true means the resulting promise will always fulfill with an array of the callback's success value(s).
function files(dirname, callback) {
  var file_1 = path.join(__dirname, dirname, '28.method.json')
  var file_2 = path.join(__dirname, dirname, '30.promisify.gm.jpg')

  setTimeout(function () {
    callback(null, file_1, file_2)
  }, 2000)
}

function Search() {
  this.version = function () {
    return '0.1.0'
  }
}

Search.prototype.getPath = function (filename, callback) {
  var self = this
  var filePath = path.join(__dirname, '../asset', filename)

  setTimeout(function () {
    callback(null, filePath, self.version())
  }, 2000)
}

var search = new Search()

var fileAsync = Promise.promisify(file)

var filesAsync_success = Promise.promisify(files, {
  multiArgs: true
})
var filesAsync_failed = Promise.promisify(files)

var getPathAsync_success = Promise.promisify(search.getPath, {
  context: search,
  multiArgs: true
})
var getPathAsync_failed = Promise.promisify(search.getPath, {
  // context: search,
  multiArgs: true
})


fileAsync('30.promisify.jpg')
  .then(function (result) {
    console.log(('---------------fileAsync---------------').green)
    console.log(result)
    console.log('\n')
  })

filesAsync_success('../asset')
  .then(function (result) {
    console.log(('---------------filesAsync_success---------------').green)
    console.log(result)
    console.log('\n')
  })

filesAsync_failed('../asset')
  .then(function (result) {
    console.log(('---------------filesAsync_failed---------------').green)
    console.log(result)
    console.log('\n')
  })

getPathAsync_success('30.promisify.jpg')
  .then(function (result) {
    console.log(('---------------getPathAsync_success---------------').green)
    console.log(result)
    console.log('\n')
  })

getPathAsync_failed('30.promisify.jpg')
  .then(function (result) {
    console.log(('---------------getPathAsync_failed---------------').green)
    console.log(result)
    console.log('\n')
  })
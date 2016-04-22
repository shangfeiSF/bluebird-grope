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

var middle = function (result) {
  return fs.readFileAsync(path.join(__dirname, '../asset', '42.tap.json'), 'utf-8')
    .then(JSON.parse)
    .then(function (data) {
      var data = data
      data.count = data.count + 1
      data.array.push(result)
      console.log(data)
      return fs.writeFileAsync(path.join(__dirname, '../asset', '42.tap.json'), JSON.stringify(data, null, 2))
    })
}

getBasenameAsync(__filename)
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
    return result
  }, function (error) {
    console.log('----------------------------'.red)
    console.log(error)
    console.log('----------------------------\n'.red)
    return '123'
  })
  .tap(middle)
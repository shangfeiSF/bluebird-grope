#!/usr/bin/env node
var path = require('path')

var Promise = require('bluebird')
var fs = Promise.promisifyAll(require("fs"))

var colors = require('colors')
var nopt = require('nopt')

var common = require('./00.common')

function Query() {
  this.limit = 10
  this.cache = {
    "3": "map",
    "4": "any"
  }

  this.options = nopt({
    input: Number
  }, {
    'in': ['--input'],
    'in1': ['--input', '1'],
    'in2': ['--input', '2'],
    'in3': ['--input', '3'],
    'in4': ['--input', '4'],
    'in8': ['--input', '8'],
    'in9': ['--input', '9']
  }, process.argv, 2)

  this.db = path.join(__dirname, '../asset', '28.method.json')
}

Query.prototype.find = function () {
  var self = this

  /* Promise.try 与 Promise.method 都可以将一般的逻辑转换成promise */
  return Promise.try(function () {
    var input = self.options.input ? self.options.input : null

    if (input === null) {
      // Start the chain of promises with Promise.try.
      // Any synchronous exceptions will be turned into rejections on the returned promise.
      throw new Error("need input")
    }

    if (input > 10) {
      // Start the chain of promises with Promise.try.
      // Any synchronous exceptions will be turned into rejections on the returned promise.
      throw new Error("input is beyond " + self.limit)
    }

    if (self.cache.hasOwnProperty(input)) {
      return Promise.resolve({
        message: '[Server] --- Read in cache',
        name: self.cache[input]
      })
    }

    return fs.readFileAsync(self.db)
      .then(function (data) {
        var data = JSON.parse(data)
        var result = {
          message: '[Server] --- Read in dataBase',
          name: 'None field named ' + input,
        }

        if (data.hasOwnProperty(input)) {
          result.name = data[input]
        }

        return result
      })
  })
}

new Query()
  .find()
  .then(function (result) {
    console.log('---------------------------------------'.white)
    console.log(result.message.green)
    console.log(('Name --- ' + result.name).green)
  }, function (err) {
    console.log('---------------------------------------'.white)
    console.log((err + '').red)
  })
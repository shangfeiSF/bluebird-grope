#!/usr/bin/env node
var path = require('path')

var Promise = require('bluebird')
var fs = Promise.promisifyAll(require("fs"))

var nopt = require('nopt')
var colors = require('colors')

var common = require('./00.common')

function Query() {
  this.limit = 9

  this.options = nopt({
    input: Number
  }, {
    'i': ['--input'],
    // only in dataBase
    'i1': ['--input', '1'],
    'i2': ['--input', '2'],
    // in cache and dataBase
    'i3': ['--input', '3'],
    'i4': ['--input', '4'],
    // only in dataBase
    'i5': ['--input', '5'],
    'i6': ['--input', '6'],
    'i7': ['--input', '7'],
    // none in cache and dataBase
    'i8': ['--input', '8'],
    'i9': ['--input', '9'],
    // beyond limit
    'i10': ['--input', '10']
  }, process.argv, 2)

  this.cache = {
    "3": "map",
    "4": "any"
  }

  this.db = path.join(__dirname, '../asset', '28.method.database.json')
}

// original function to use Promise with Promise.resolve and Promise.reject
Query.prototype.find = function () {
  var self = this
  var input = self.options.input ? self.options.input : null

  // rejected if no input
  if (input === null) {
    return Promise.reject(new Error("need input"))
  }

  // rejected if input beyond linit
  if (input > self.limit) {
    return Promise.reject(new Error("input is beyond " + self.limit))
  }

  // fulfilled with cache
  if (self.cache.hasOwnProperty(input)) {
    return Promise.resolve({
      from: 'cache',
      name: this.cache[input]
    })
  }

  // fulfilled with database
  return fs.readFileAsync(self.db)
    .then(function (data) {
      var data = JSON.parse(data)
      var result = {
        from: 'dataBase',
        name: 'None field named ' + input,
      }

      if (data.hasOwnProperty(input)) {
        result.name = data[input]
      }

      return result
    })
}

// Promise.method returns a new function that wraps the given function
// The new function returns a promise that is fulfilled with the original functions return values
// The new function returns a promise that is rejected with thrown exceptions from the original function
Query.prototype.findPromise = Promise.method(function () {
  var self = this
  var input = self.options.input ? self.options.input : null

  if (input === null) {
    throw new Error("need input")
  }

  if (input > self.limit) {
    throw new Error("input is beyond " + self.limit)
  }

  if (self.cache.hasOwnProperty(input)) {
    return {
      from: 'cache',
      name: this.cache[input]
    }
  }

  return fs.readFileAsync(self.db)
    .then(function (data) {
      var data = JSON.parse(data)
      var result = {
        from: 'dataBase',
        name: 'None field named ' + input,
      }

      if (data.hasOwnProperty(input)) {
        result.name = data[input]
      }

      return result
    })
})

new Query()
  .find()
  .then(function (result) {
    console.log('find result:'.white)

    var from = 'From --- ' + result.from
    var name = 'Name --- ' + result.name

    if (result.from === 'cache') {
      from = colors.yellow(from)
      name = colors.yellow(name)
    } else if (result.from === 'dataBase') {
      from = colors.green(from)
      name = colors.green(name)
    }

    console.log(from)
    console.log(name)
  }, function (error) {
    console.log(String(error).red)
  })

new Query()
  .findPromise()
  .then(function (result) {
    console.log('findPromise result:'.white)

    var from = 'From --- ' + result.from
    var name = 'Name --- ' + result.name

    if (result.from === 'cache') {
      from = colors.yellow(from)
      name = colors.yellow(name)
    } else if (result.from === 'dataBase') {
      from = colors.green(from)
      name = colors.green(name)
    }

    console.log(from)
    console.log(name)
  }, function (error) {
    console.log(String(error).red)
  })

// 28.method.js -i1
// 28.method.js -i2
// 28.method.js -i3
// 28.method.js -i4
// 28.method.js -i8
// 28.method.js -i9
// 28.method.js -i10
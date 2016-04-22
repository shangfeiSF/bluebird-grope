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

  this.db = path.join(__dirname, '../asset', '29.try.dataBase.json')
}

// Start the chain of promises with Promise.try.
// Any synchronous exceptions will be turned into rejections on the returned promise.
Query.prototype.find = function () {
  var self = this

  return Promise.try(function () {
    var input = self.options.input ? self.options.input : null

    if (input === null) {
      throw new Error("need input")
    }

    if (input > self.limit) {
      throw new Error("input is beyond " + self.limit)
    }

    if (self.cache.hasOwnProperty(input)) {
      return Promise.resolve({
        from: 'cache',
        name: self.cache[input]
      })
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
}

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

// 29.try.js -i1
// 29.try.js -i2
// 29.try.js -i3
// 29.try.js -i4
// 29.try.js -i8
// 29.try.js -i9
// 29.try.js -i10
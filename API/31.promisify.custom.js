#!/usr/bin/env node
var path = require('path')

var Promise = require('bluebird')
var fs = Promise.promisifyAll(require("fs"))

var nopt = require('nopt')
var colors = require('colors')

var options = nopt({
  rejected: Boolean
}, {
  'r': ['--rejected'],
  'r1': ['--rejected', 'true'],
  'r2': ['--rejected', 'false'],
}, process.argv, 2)

// Promise.promisify can promisify the function that satisfies the conditions described below:
// (1) The  function should conform to node.js convention of accepting a callback as last argument
// (2) and calling that callback with error as the first argument
// (3) and success value on the second argument.
function fullPath(name, callback) {  //(1)
  var full = path.join(__dirname, '../asset', name)

  console.log('START...')
  console.time('END')

  setTimeout(function () {
    console.timeEnd('END')

    if (options.rejected) {
      callback(new Error('failed to get the fullPath of ' + name))  // (2)
    } else {
      callback(null, full)  // (2) (3)
    }

  }, 2000)
}

var fullPathCustom = Promise.promisify(fullPath)

fullPathCustom('31.promisify.custom.jpg')
  .then(function (result) {
    console.log(result.green)
  }, function (error) {
    console.log(String(error).red)
  })

// 31.promisify.custom.js
// 31.promisify.custom.js -r0
// 31.promisify.custom.js -r1
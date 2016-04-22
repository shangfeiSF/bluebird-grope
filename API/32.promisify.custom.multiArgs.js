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

// Setting multiArgs to true
// means the resulting promise will always fulfill with an array of the callback's success value(s)
function getDirnameAndExtname(name, callback) {
  var full = path.join(__dirname, '../asset', name)

  var dirname = path.dirname(full)
  var extname = path.extname(full)

  setTimeout(function () {
    if (options.rejected) {
      callback(new Error('failed to get the dirname and extname of ' + name))
    } else {
      callback(null, dirname, extname)
    }
  }, 2000)
}

var getDirnameAndExtname_custom_single = Promise.promisify(getDirnameAndExtname)

var getDirnameAndExtname_custom_multi = Promise.promisify(getDirnameAndExtname, {
  multiArgs: true
})

getDirnameAndExtname_custom_single('31.promisify.custom.jpg')
  .then(function (result) {
    console.log(('---------------getDirnameAndExtname_custom_single---------------').white)
    console.log(result)
  }, function (error) {
    console.log(String(error).red)
  })

getDirnameAndExtname_custom_multi('31.promisify.custom.jpg')
  .then(function (result) {
    console.log(('---------------getDirnameAndExtname_custom_multi---------------').white)
    console.log(result)
  }, function (error) {
    console.log(String(error).red)
  })

// 32.promisify.custom.multi.js
// 32.promisify.custom.multi.js -r0
// 32.promisify.custom.multi.js -r1
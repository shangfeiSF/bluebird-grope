#!/usr/bin/env node
var path = require('path')

var Promise = require('bluebird')
var fs = Promise.promisifyAll(require("fs"))

var nopt = require('nopt')
var colors = require('colors')

function Search() {
  this.version = function () {
    return '0.1.0'
  }
  this.options = nopt({
    rejected: Boolean
  }, {
    'r': ['--rejected'],
    'r1': ['--rejected', 'true'],
    'r2': ['--rejected', 'false'],
  }, process.argv, 2)
}

Search.prototype.fullPath = function (name, callback) {
  var self = this
  var full = path.join(__dirname, '../asset', name)

  setTimeout(function () {
    try {
      var rejected = self.options.rejected
      var version = self.version()

      if (rejected) {
        callback(new Error('failed to get the fullPath of ' + name))
      } else {
        callback(null, full, version)
      }
    } catch (e) {
      callback(e)
    }
  }, 2000)
}

var search = new Search()

// If pass a context, the nodeFunction will be called as a method on the context.
var fullPath_custom_multi = Promise.promisify(search.fullPath, {
  context: search,
  multiArgs: true
})

var fullPath_custom_multi_error = Promise.promisify(search.fullPath, {
  multiArgs: true
})

var fullPath_custom_single = Promise.promisify(search.fullPath, {
  context: search
})

var fullPath_custom_single_error = Promise.promisify(search.fullPath)

fullPath_custom_multi('31.promisify.custom.jpg')
  .then(function (result) {
    console.log(('---------------fullPath_custom_multi---------------').white)
    console.log(result)
  }, function (error) {
    console.log(('---------------fullPath_custom_multi---------------').white)
    console.log(String(error).red)
  })

fullPath_custom_multi_error('31.promisify.custom.jpg')
  .then(function (result) {
    console.log(('---------------fullPath_custom_multi_error---------------').white)
    console.log(result)
  }, function (error) {
    console.log(('---------------fullPath_custom_multi_error---------------').white)
    console.log(String(error).red)
  })

fullPath_custom_single('31.promisify.custom.jpg')
  .then(function (result) {
    console.log(('---------------fullPath_custom_single---------------').white)
    console.log(result)
  }, function (error) {
    console.log(('---------------fullPath_custom_single---------------').white)
    console.log(String(error).red)
  })

fullPath_custom_single_error('31.promisify.custom.jpg')
  .then(function (result) {
    console.log(('---------------fullPath_custom_single_error---------------').white)
    console.log(result)
  }, function (error) {
    console.log(('---------------fullPath_custom_single_error---------------').white)
    console.log(String(error).red)
  })

// 33.promisify.custom.context.js -r0
// 33.promisify.custom.context.js -r1
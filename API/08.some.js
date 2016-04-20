#!/usr/bin/env node
var path = require('path')

var Promise = require('bluebird')
var fs = Promise.promisifyAll(require("fs"))

var colors = require('colors')

var common = require('./00.common')

fs.readdirAsync(process.cwd())
  .then(function (names) {
    var files = []

    for (var index = 0; index < names.length; index++) {
      files.push({
        name: names[index],
        stamp: common.stamp()
      })
    }

    return files
  })
  .filter(function (file) {
    var filePath = path.join(__dirname, file.name)

    var item = fs.statAsync(filePath)
      .then(function (stat) {
        return !stat.isDirectory()
      })

    return item
  })
  .then(function (files) {
    var tasks = []

    for (var i = 0; i < files.length; i++) {
      var file = files[i]
      var filePath = path.join(__dirname, file.name)

      /*
      var info = new Promise(function (resolve) {
          resolve({
            name: file.name,
            stamp: file.stamp
          })
        })
          .then(function (info) {
            return info
          })
      */

      // Create a promise that is resolved with the given value.
      // If value is already a trusted Promise, it is returned as is.
      // If value is not a thenable, a fulfilled Promise is returned with value as its fulfillment value
      var info = Promise.resolve({
        name: file.name,
        stamp: file.stamp
      })

      var stat = fs.statAsync(filePath)

      var contents = fs.readFileAsync(filePath)

      tasks.push(
        Promise.join(info, stat, contents, function (info, stat, contents) {
          return {
            name: info.name,
            stamp: info.stamp,
            size: stat.size,
            length: contents.length
          }
        })
      )
    }

    return Promise.some(tasks, 3)
  })
  .then(function (files) {
    console.log('isArray?', files instanceof Array)
    console.log(files)
  })

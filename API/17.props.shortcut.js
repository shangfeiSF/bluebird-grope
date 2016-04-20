#!/usr/bin/env node
var path = require('path')

var Promise = require('bluebird')

var colors = require('colors')

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
    var tasks = {}

    for (var i = 0; i < files.length; i++) {
      var file = files[i]
      var filePath = path.join(__dirname, file.name)

      var info
      if (i == 0) {
        info = Math.random() > 0.5 ?
          Promise.resolve({
            name: file.name,
            stamp: file.stamp,
            code: 200
          }) :
          Promise.reject({
            name: file.name,
            stamp: file.stamp,
            code: 404
          })
      } else {
        info = Promise.resolve({
          name: file.name,
          stamp: file.stamp,
          code: 200
        })
      }

      var stat = fs.statAsync(filePath)

      var contents = fs.readFileAsync(filePath)

      tasks[i] = Promise.join(info, stat, contents, function (info, stat, contents) {
        return {
          name: info.name,
          stamp: info.stamp,
          code: info.code,
          size: stat.size,
          length: contents.length
        }
      })
    }

    return tasks
  })
  .props()
  .then(function (result) {
    console.dir(result)
  }, function (err) {
    console.log(err)
  })
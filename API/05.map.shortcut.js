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
  .map(function (file) {
    var filePath = path.join(__dirname, file.name)

    var stat = fs.statAsync(filePath)

    var contents = fs.readFileAsync(filePath)

    /* Promise.join */
    var item = Promise.join(stat, contents, function (stat, contents) {
      return {
        name: file.name,
        stamp: file.stamp,
        stat: stat,
        contents: contents
      }
    })

    return item
  })
  .then(function (files) {
    for (var i = 0; i < files.length; i++) {
      var file = files[i]
      var log = [file.stamp, '---', file.name, '---', file.stat.size, '---', file.contents.length].join(' ')
      console.log((log).yellow)
    }
  })

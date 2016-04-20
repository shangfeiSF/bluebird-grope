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
    return Promise.each(files, function (file, index) {
      var filePath = path.join(__dirname, file.name)

      var info = Promise.resolve({
        name: file.name,
        stamp: file.stamp,
        index: index
      })

      var stat = fs.statAsync(filePath)

      var contents = fs.readFileAsync(filePath)

      var result = Promise.join(info, stat, contents, function (info, stat, contents) {
        var log = [info.index, '---', info.name, '---', info.stamp, '---', contents.length, '---', stat.size].join(' ')
        console.log((log).yellow)
      })

      return result
    })
  })
  .then(function (files) {
    console.log('-----------------------------------')
    console.log(files)  // each 返回输入的数组
    console.log('-----------------------------------')
  })

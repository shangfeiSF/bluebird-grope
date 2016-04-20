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
    var cencus = Promise.reduce(files, function (census, file, index, length) {
      var filePath = path.join(__dirname, file.name)

      var info = Promise.resolve({
        name: file.name,
        stamp: file.stamp,
        index: index
      })

      var stat = fs.statAsync(filePath)

      var contents = fs.readFileAsync(filePath)

      return Promise.join(info, stat, contents, function (info, stat, contents) {
        var log = [info.index, '---', info.name, '---', info.stamp, '---', contents.length, '---', stat.size].join(' ')
        console.log((log).yellow)

        census.push({
          original: info,
          extention: {
            squence: index + '/' + length,
            size: stat.size,
            length: contents.length
          }
        })

        return census
      })
    }, [])

    return cencus
  })
  .then(function (census) {
    console.log('-----------------------------------')
    console.log(census)
    console.log('-----------------------------------')
  })

#!/usr/bin/env node
var path = require('path')

var Promise = require('bluebird')
var fs = Promise.promisifyAll(require("fs"))

var colors = require('colors')

var common = require('./00.common')

console.time("START")
var MAP = {
  p1: [],
  p2: []
}

/*
 Promise.mapSeries is like Promise.map in that it returns an array with the results of the iterator function
 Promise.mapSeries is like Promise.each it waits for each iterator function call to finish before it moves on to the next item in the array
 Promise.map does not wait for the previous iterator call to finish.
 */

fs.readdirAsync(process.cwd())
  .then(function (names) {
    var files = []

    for (var index = 0; index < names.length; index++) {
      MAP.p1.push(names[index])

      files.push({
        name: names[index],
        stamp: common.stamp()
      })
    }

    return files
  })
  .mapSeries(function (file) {
    var name = file.name
    var stamp = file.stamp

    MAP.p2.push(name)

    var filePath = path.join(__dirname, name)

    var stat = fs.statAsync(filePath)

    var contents = fs.readFileAsync(filePath)
      .catch(function (error) {
        console.log(error)
      })

    return Promise.join(stat, contents, function (stat, contents) {
      return {
        name: name,
        stamp: stamp,
        stat: stat,
        contents: contents
      }
    })
  })
  .then(function (files) {
    console.log('---------------------------------------'.white)
    for (var index = 0; index < files.length; index++) {
      var file = files[index]
      var p1Index = MAP.p1.indexOf(file.name)
      var p2Index = MAP.p2.indexOf(file.name)

      var log = [[p1Index, p2Index, index].join('---'), [file.name, file.stamp, file.stat.size].join('---')].join(' ==> ')
      var ckeck = (function (indexs) {
        var first = indexs[0]

        return indexs.every(function (i) {
          return i === first
        })
      })([p1Index, p2Index, index])

      log = ckeck ? log.green : log.yellow

      console.log(log)
    }
    console.log('---------------------------------------'.white)
    console.timeEnd("START")
    console.log('---------------------------------------'.white)
  })
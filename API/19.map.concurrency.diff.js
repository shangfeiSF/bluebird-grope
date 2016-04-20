#!/usr/bin/env node
var path = require('path')

var Promise = require('bluebird')
var fs = Promise.promisifyAll(require("fs"))

var colors = require('colors')
var nopt = require('nopt')

var common = require('./00.common')

var options = nopt({
  concurrency: Number
}, {
  'co': ['--concurrency'],
  'co1': ['--concurrency', '1'],
  'co2': ['--concurrency', '2'],
  'co3': ['--concurrency', '3'],
  'co4': ['--concurrency', '4'],
  'coi': ['--concurrency', 'Infinity']
}, process.argv, 2)
var concurrency = options.concurrency ?
  parseFloat(options.concurrency) :
  parseFloat('Infinity')

console.time("START")
var MAP = {
  p1: [],
  p2: []
}

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
  .map(function (file) {
    var name = file.name
    var stamp = file.stamp

    MAP.p2.push(name)

    var filePath = path.join(__dirname, name)

    var stat = fs.statAsync(filePath)

    var contents = fs.readFileAsync(filePath)
      .catch(function (error) {
      })

    return Promise.join(stat, contents, function (stat, contents) {
      return {
        name: name,
        stamp: stamp,
        stat: stat,
        contents: contents
      }
    })
  }, {
    concurrency: concurrency
  })
  // map的执行顺序是随机的
  // map 返回files的顺序是与输入保持一致的
  .then(function (files) {
    console.log('---------------------------------------'.white)
    console.log('Promise.map concurrency options：' + (concurrency + '').white)
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


// 19.map.concurrency.diff.js
// 19.map.concurrency.diff.js -co1
// 19.map.concurrency.diff.js -co2
// 19.map.concurrency.diff.js -co3
// 19.map.concurrency.diff.js -co4
// 19.map.concurrency.diff.js -co 10
// 19.map.concurrency.diff.js -coi
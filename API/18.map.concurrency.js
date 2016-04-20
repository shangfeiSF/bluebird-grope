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
  p1: []
}

fs.readdirAsync(process.cwd())
  .map(function (name) {
    MAP.p1.push(name)

    var filePath = path.join(__dirname, name)

    var stat = fs.statAsync(filePath)

    var contents = fs.readFileAsync(filePath)
      .catch(function (error) {
      })

    return Promise.join(stat, contents, function (stat, contents) {
      return {
        name: name,
        stat: stat,
        contents: contents
      }
    })
  }, {
    concurrency: concurrency
  })
  .then(function (files) {
    console.log('---------------------------------------'.white)
    console.log('Promise.map concurrency options：' + (concurrency + '').white)
    console.log('---------------------------------------'.white)
    for (var index = 0; index < files.length; index++) {
      var file = files[index]
      var p1Index = MAP.p1.indexOf(file.name)

      var log = [[p1Index, index].join('---'), [file.name, file.stat.size].join('---')].join(' ==> ')
      var ckeck = (function (indexs) {
        var first = indexs[0]

        return indexs.every(function (i) {
          return i === first
        })
      })([p1Index, index])

      log = ckeck ? log.green : log.yellow

      console.log(log)
    }
    console.log('---------------------------------------'.white)
    console.timeEnd("START")
    console.log('---------------------------------------'.white)
  })


// 18.map.concurrency.js
// 18.map.concurrency.js -co1
// 18.map.concurrency.js -co2
// 18.map.concurrency.js -co3
// 18.map.concurrency.js -co4
// 18.map.concurrency.js -co 10
// 18.map.concurrency.js -coi
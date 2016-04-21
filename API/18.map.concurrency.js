#!/usr/bin/env node
var path = require('path')

var Promise = require('bluebird')
var fs = Promise.promisifyAll(require("fs"))

var nopt = require('nopt')
var colors = require('colors')

var common = require('./00.common')

var principle = path.join(process.cwd(), 'principle')
var options = nopt({
  concurrency: Number
}, {
  'c': ['--concurrency'],
  'c1': ['--concurrency', '1'],
  'c2': ['--concurrency', '2'],
  'c3': ['--concurrency', '3'],
  'ci': ['--concurrency', 'Infinity']
}, process.argv, 2)
var INDEX = {
  p1: []
}

console.time("START")

fs.readdirAsync(principle)
  .map(function (name) {
    INDEX.p1.push(name)

    var stat = fs.statAsync(path.join(principle, name))

    var contents = fs.readFileAsync(path.join(principle, name))
      // no need to except the directories as this catch
      .catch(function (error) {
        return ''
      })

    return Promise.join(stat, contents, function (stat, contents) {
      return {
        name: name,
        stat: stat,
        contents: contents
      }
    })
  }, {
    /*
     * the concurrency set up the upper limit of the Promise.map to deal
     * no further callbacks are called until one of the pending Promises resolves
     * concurrency default is 'Infinity'
     * */
    concurrency: options.concurrency ? parseFloat(options.concurrency) : parseFloat('Infinity')
  })
  /*
   * Promise.map will return a array with the same order of its original
   * but the actual-deal-order of Promise.map iterate is different !
   * */
  .then(function (files) {
    console.log('concurrency:'.green)
    console.log(options.concurrency ? parseFloat(options.concurrency) : parseFloat('Infinity'))

    console.log('Promise.map actual-deal-order:'.green)
    console.log(JSON.stringify(INDEX.p1, null, 2))

    files.forEach(function (file, index) {
      var p1 = INDEX.p1.indexOf(file.name)

      var ckeck = (function (list) {
        return list.every(function (i) {
          return i === list[0]
        })
      })([index, p1])

      var msg = [index, p1, file.name, file.stat.size, file.contents.length].join(' --- ')

      msg = ckeck ? msg.green : msg.yellow

      console.log(msg)
    })

    console.timeEnd("START")
  })

// 18.map.concurrency.js -c1
// 18.map.concurrency.js -c2
// 18.map.concurrency.js -c3
// 18.map.concurrency.js
// 18.map.concurrency.js -ci
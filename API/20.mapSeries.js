#!/usr/bin/env node
var path = require('path')

var Promise = require('bluebird')
var fs = Promise.promisifyAll(require("fs"))

var colors = require('colors')

var common = require('./00.common')

var principle = path.join(process.cwd(), 'principle')
var INDEX = {
  p1: [],
  p2: []
}

console.time("START")

fs.readdirAsync(principle)
  .then(function (names) {
    return names.map(function (name) {
      INDEX.p1.push(name)

      return {
        name: name
      }
    })
  })
  /*
   Promise.mapSeries is like Promise.map in that it returns an array with the results of the iterator function
   Promise.mapSeries is like Promise.each it waits for each iterator function call to finish before it moves on to the next item in the array
   Promise.map does not wait for the previous iterator call to finish.
   */
  .mapSeries(function (file) {
    var name = file.name
    INDEX.p2.push(name)

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
  })
  /*
   * Promise.mapSeries will return a array with the same order of its original
   * and the actual-deal-order of Promise.mapSeries iterate is also same !
   * */
  .then(function (files) {
    console.log('Promise.mapSeries original-order:'.green)
    console.log(JSON.stringify(INDEX.p1, null, 2))

    console.log('Promise.mapSeries actual-deal-order:'.green)
    console.log(JSON.stringify(INDEX.p2, null, 2))

    files.forEach(function (file, index) {
      var p1 = INDEX.p1.indexOf(file.name)
      var p2 = INDEX.p2.indexOf(file.name)

      var ckeck = (function (list) {
        return list.every(function (i) {
          return i === list[0]
        })
      })([index, p2, p1])

      var msg = [index, p2, p1, file.name, file.stat.size, file.contents.length].join(' --- ')

      msg = ckeck ? msg.green : msg.yellow

      console.log(msg)
    })

    console.timeEnd("START")
  })

// 20.mapSeries.js
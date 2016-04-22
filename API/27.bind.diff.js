#!/usr/bin/env node
var path = require('path')

var Promise = require('bluebird')
var fs = Promise.promisifyAll(require("fs"))

var colors = require('colors')

var common = require('./00.common')

var principle = path.join(process.cwd(), 'principle')
// generate a logFile name
var logFileName = '27.bind.diff.' + common.stamp().replace(/\:/g, '-') + '.json'
// create a promise
var promiseObj = fs.openAsync(path.join(__dirname, '../log', logFileName), 'a+')
  .then(function (fd) {
    return fs.writeAsync(fd, '[\r')
      // Promise.return()
      .return({
        fd: fd,
        paths: {}
      })
  })

console.time("START")

fs.readdirAsync(principle)
  // .bind a promise
  .bind(promiseObj)
  .then(function (names) {
    return names.map(function (name, index) {
      return {
        index: index,
        name: name,
        stamp: common.stamp()
      }
    })
  })
  .filter(function (file) {
    /* restrore the full path into obj.paths */
    this.paths[file.name] = path.join(principle, file.name)

    /* write the full path into json file */
    var record = {}
    record[file.name] = path.join(principle, file.name)
    var logger = fs.writeAsync(this.fd, JSON.stringify(record, null, 2) + ',\r')

    var item = fs.statAsync(path.join(principle, file.name))
      .then(function (stat) {
        return !stat.isDirectory()
      })

    return Promise.join(logger, item, function (logger, item) {
      return item
    })
  })
  .then(function (files) {
    var that = this

    return files.map(function (file, index) {
      var info = Promise.resolve({
        task: index,
        index: file.index,
        name: file.name,
        stamp: file.stamp
      })

      var stat = fs.statAsync(path.join(principle, file.name))

      var contents = fs.readFileAsync(path.join(principle, file.name))

      return Promise.join(info, stat, contents, function (info, stat, contents) {
        var result = {
          task: info.task,
          index: info.index,
          name: info.name,
          stamp: info.stamp,
          size: stat.size,
          length: contents.length
        }

        /* write the census into json file */
        // Promise.return()
        return fs.writeAsync(that.fd, JSON.stringify(result, null, 2) + ',\r').return(result)
      })
    })
  })
  .spread(function () {
    console.log('spread return arguments:'.white)
    console.log(JSON.stringify(arguments).yellow)

    console.log('Promise.spread return Array ? '.white, arguments instanceof Array)

    console.log('bind object:'.white)
    console.log(JSON.stringify(this, null, 2).green)

    var that = this
    fs.writeAsync(that.fd, '{}\r]\r')
      .then(function () {
        fs.closeAsync(that.fd)
          .then(function () {
            console.timeEnd('START')
          })
      })
  })
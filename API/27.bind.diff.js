#!/usr/bin/env node
var path = require('path')

var Promise = require('bluebird')
var fs = Promise.promisifyAll(require("fs"))

var colors = require('colors')

var common = require('./00.common')

var logFileName = '27.bind.diff.' + common.stamp().replace(/\:/g, '-') + '.json'
var global = fs.openAsync(path.join(__dirname, '../log', logFileName), 'a+')
  .then(function (fd) {
    return fs.writeAsync(fd, '[\r')
      // Promise 提供的return
      .return({
        fd: fd,
        paths: []
      })
  })

// .bind一个Promise
fs.readdirAsync(process.cwd())
  .bind(global)
  .filter(function (name) {
    var filePath = path.join(__dirname, name)

    this.paths[name] = filePath

    var record = {}
    record[name] = filePath
    var logger = fs.writeAsync(this.fd, JSON.stringify(record, null, 2) + ',\r')

    var item = fs.statAsync(filePath)
      .then(function (stat) {
        return !stat.isDirectory()
      })

    return Promise.join(logger, item, function (logger, item) {
      return item
    })
  })
  .then(function (names) {
    var tasks = []

    for (var i = 0; i < names.length; i++) {
      var name = names[i]
      var filePath = this.paths[name]

      var info = Promise.resolve({
        name: name,
        stamp: common.stamp()
      })

      var stat = fs.statAsync(filePath)

      var contents = fs.readFileAsync(filePath)

      var _global = this
      tasks.push(
        Promise.join(info, stat, contents, function (info, stat, contents) {
          var result = {
            name: info.name,
            stamp: info.stamp,
            size: stat.size,
            length: contents.length
          }

          return fs.writeAsync(_global.fd, JSON.stringify(result, null, 2) + ',\r')
            .then(function () {
              return result
            })
        })
      )
    }

    return tasks
  })
  .spread(function () {
    Array.prototype.slice.call(arguments).forEach(function (file, index) {
      var log = [[index].join('---'), [file.name, file.stamp, file.size, file.length].join('---')].join(' ==> ')
      console.log(log.green)
    })

    console.log(this)

    var _global = this
    fs.writeAsync(this.fd, ']\r')
      .then(function () {
        fs.closeAsync(_global.fd)
          .then(function () {
            console.log('End')
          })
      })
  })
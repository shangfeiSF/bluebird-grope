#!/usr/bin/env node
var path = require('path')

var Promise = require('bluebird')
var fs = Promise.promisifyAll(require("fs"))

var colors = require('colors')

var common = require('./00.common')

var principle = path.join(process.cwd(), 'principle')

fs.readdirAsync(principle)
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
    return fs.statAsync(path.join(principle, file.name))
      .then(function (stat) {
        return !stat.isDirectory()
      })
  })
  .then(function (files) {
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
        return {
          task: info.task,
          index: info.index,
          name: info.name,
          stamp: info.stamp,
          size: stat.size,
          length: contents.length
        }
      })
    })
  })
  .spread(function (argv1, argv2) {
    console.log('spread return argv1 and argv2:'.white)
    console.log(JSON.stringify(argv1).yellow)
    console.log(JSON.stringify(argv2).yellow)

    console.log('spread return arguments:'.white)
    console.log(JSON.stringify(arguments).yellow)

    console.log('Promise.spread return Array ? '.white, arguments instanceof Array)

    var files = Array.prototype.slice.call(arguments)

    files.forEach(function (file, index) {
      var msg = [index, file.task, file.index, file.name, file.stamp, file.size, file.length].join(' --- ')
      console.log(msg.yellow)
    })
  })

fs.readdirAsync(principle)
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
    return fs.statAsync(path.join(principle, file.name))
      .then(function (stat) {
        return !stat.isDirectory()
      })
  })
  .then(function (files) {
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
        return {
          task: info.task,
          index: info.index,
          name: info.name,
          stamp: info.stamp,
          size: stat.size,
          length: contents.length
        }
      })
    })
  })
  .all()
  .then(function (files) {
    console.log('all return files:'.white)
    console.log(JSON.stringify(files).green)

    console.log('all return arguments:'.white)
    console.log(JSON.stringify(arguments).green)

    console.log('Promise.all return Array ? '.white, files instanceof Array)

    files.forEach(function (file, index) {
      var msg = [index, file.task, file.index, file.name, file.stamp, file.size, file.length].join(' --- ')
      console.log(msg.green)
    })
  })
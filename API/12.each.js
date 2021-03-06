#!/usr/bin/env node
var path = require('path')

var Promise = require('bluebird')
var fs = Promise.promisifyAll(require("fs"))

var nopt = require('nopt')
var colors = require('colors')

var common = require('./00.common')

var principle = path.join(process.cwd(), 'principle')
var options = nopt({
  rejected: Array
}, {
  'r': ['--rejected'],
  'r1': ['--rejected', '0', '--rejected', '1'],
  'r2': ['--rejected', '0', '--rejected', '1', '--rejected', '2'],
}, process.argv, 2)

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
    /*
    * Promise.each unlike .some and .any
    * Promise.each will sequential traversal the tasks
    * and rejected once one task is rejected
    * */
    return Promise.each(files, function (file, index) {
      // rejected when options.rejected is config
      var info
      if (options.rejected && options.rejected.indexOf(String(index)) > -1) {
        /* Promise.reject */
        info = Promise.reject({
          reason: "Force to reject " + index
        })
      } else {
        /* Promise.resolve */
        info = Promise.resolve({
          task: index,
          index: file.index,
          name: file.name,
          stamp: file.stamp
        })
      }

      var stat = fs.statAsync(path.join(principle, file.name))

      var contents = fs.readFileAsync(path.join(principle, file.name))

      return Promise.join(info, stat, contents, function (info, stat, contents) {
        var msg = [info.task, info.index, file.name, file.stamp, stat.size, contents.length].join(' --- ')
        console.log(msg.yellow)

        return {
          task: info.task,
          index: info.index,
          name: info.name,
          stamp: info.stamp,
          stat: stat,
          contents: contents
        }
      })
    })
  })
  /* Promise.each will return the original forever */
  .then(function (files) {
    files.forEach(function (file) {
      console.log(JSON.stringify(file).green)
    })
  }, function (error) {
    console.log(JSON.stringify(error).red)
  })

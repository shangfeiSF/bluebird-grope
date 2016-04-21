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
    return files.map(function (file, index) {
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
  /*
   * Promise.props like .each
   * Promise.props will sequential traversal the tasks
   * and rejected once one task is rejected
   * */
  .props()
  /*
   * Promise.props unlike .each
   * Promise.props will return a object including properties whose value is the result of promise
   * */
  .then(function (files) {
    console.log('isArray?', files instanceof Array)
    console.log('isObject?', files instanceof Object)

    for (var p in files) {
      var file = files[p]
      var msg = [p, file.task, file.index, file.name, file.stamp, file.stat.size, file.contents.length].join(' --- ')
      console.log(msg.green)
    }
  }, function (error) {
    console.log(JSON.stringify(error).red)
  })
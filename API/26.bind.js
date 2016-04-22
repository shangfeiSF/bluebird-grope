#!/usr/bin/env node
var path = require('path')

var Promise = require('bluebird')
var fs = Promise.promisifyAll(require("fs"))

var colors = require('colors')

var common = require('./00.common')

var principle = path.join(process.cwd(), 'principle')
var obj = {
  paths: {},
  census: {}
}

fs.readdirAsync(principle)
  /* bind a normal object */
  .bind(obj)
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

    return fs.statAsync(path.join(principle, file.name))
      .then(function (stat) {
        return !stat.isDirectory()
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
        /* restrore the census into obj.census */
        that.census[info.name] = {
          size: stat.size,
          length: contents.length
        }

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
  .spread(function () {
    console.log('spread return arguments:'.white)
    console.log(JSON.stringify(arguments).yellow)

    console.log('Promise.spread return Array ? '.white, arguments instanceof Array)

    console.log('bind object:'.white)
    console.log(JSON.stringify(this, null, 2).green)
  })
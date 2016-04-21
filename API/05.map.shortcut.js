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
  .map(function (file) {
    var stat = fs.statAsync(path.join(principle, file.name))

    var contents = fs.readFileAsync(path.join(principle, file.name))

    /* Promise.join */
    return Promise.join(stat, contents, function (stat, contents) {
      return {
        index: file.index,
        name: file.name,
        stamp: file.stamp,
        stat: stat,
        contents: contents
      }
    })
  })
  .then(function (files) {
    files.forEach(function (file, index) {
      var msg = [index, file.index, file.name, file.stamp, file.stat.size, file.contents.length].join(' --- ')
      console.log(msg.green)
    })
  })

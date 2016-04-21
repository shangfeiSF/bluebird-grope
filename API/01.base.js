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
  .then(function (files) {
    files.forEach(function (file, index) {
      var msg = [index, file.index, file.name, file.stamp].join(' --- ')
      console.log(msg.green)
    })
  })

#!/usr/bin/env node
var path = require('path')

var Promise = require('bluebird')
var fs = Promise.promisifyAll(require("fs"))

var colors = require('colors')

var common = require('./00.common')

var global = {
  seed: Math.floor(Math.random() * 100),
  paths: {},
  cencus: {}
}

// .bind一个Object
fs.readdirAsync(process.cwd())
  .bind(global)
  .filter(function (name) {
    var filePath = path.join(__dirname, name)

    // paths 存储文件的绝对路径
    this.paths[name] = filePath

    var item = fs.statAsync(filePath)
      .then(function (stat) {
        return !stat.isDirectory()
      })

    return item
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

      var _global = this   // Promise.join 中 this 不再指向global
      tasks.push(
        Promise.join(info, stat, contents, function (info, stat, contents) {
          // cencus 存储文件的信息
          _global.cencus[info.name] = {
            name: info.name,
            stamp: info.stamp,
            size: stat.size,
            length: contents.length
          }

          return {
            name: info.name,
            stamp: info.stamp,
            size: stat.size,
            length: contents.length
          }
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
    console.dir(this)
  })
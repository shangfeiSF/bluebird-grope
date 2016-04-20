#!/usr/bin/env node
var path = require('path')

var Promise = require('bluebird')

var colors = require('colors')
var openSync = require('fs').openSync
var writeSync = require('fs').writeSync

// Promise.promisifyAll 的函数原型：
/*
 Promise.promisifyAll(
 Object target,
 [Object options {
 suffix: String="Async",
 filter: boolean function(String name, function func, Object target, boolean passesDefaultFilter),
 multiArgs: boolean=false,
 promisifier: function(function originalFunction, function defaultPromisifier)}]
 ) -> Object
 */

// Option: filter
// filter 的函数原型
/*
 Promise.promisifyAll(Object target, {
 filter: function(name, func, target, passesDefaultFilter) {
 // name = the property name to be promisified without suffix
 // func = the function entity
 // target = the target object where the promisified func will be put with name + suffix
 // passesDefaultFilter = whether the default filter would be passed
 // return boolean (return value is coerced, so not returning anything is same as returning false)

 return passesDefaultFilter && ...}
 })
 */

function promisifyAllWapper(module, config) {
  var logger = openSync(path.join(__dirname, '../log', config.loggerName), 'w+')
  var log = {}

  var promisifyModule = Promise.promisifyAll(module, {
    suffix: config.suffix,

    filter: function (name, func, target, passesDefaultFilter) {
      log[name] = {
        name: name,
        func: func.toString(),
        target: target,
        passesDefaultFilter: passesDefaultFilter
      }

      return passesDefaultFilter && config.filter(name)
    }
  })

  log.promisifyModule = promisifyModule

  writeSync(logger, JSON.stringify(log, null, 2))

  return promisifyModule
}

var whole = promisifyAllWapper(require('fs'), {
  loggerName: '33.promisifyAll.filter.whole.json',

  suffix: 'CustomWhole',

  filter: function (name) {
    return true
  }
})

var partial = promisifyAllWapper(require('fs'), {
  loggerName: '33.promisifyAll.filter.partial.json',

  suffix: 'CustomPartial',

  filter: function (name) {
    return name === 'readdir'
  }
})

whole.readdirCustomWhole(path.join(__dirname, '../asset'))
  .then(function (names) {
    console.log('--------------------------------------'.yellow)
    console.log(('[Files in asset directory]').green)
    console.log(names)
    console.log('--------------------------------------\n'.yellow)
  })

whole.statCustomWhole(__filename)
  .then(function (state) {
    console.log('--------------------------------------'.yellow)
    console.log(('[File state of ' + __filename + ']').green)
    console.log(JSON.stringify(state, null, 2))
    console.log('--------------------------------------\n'.yellow)
  })

partial.readdirCustomPartial(path.join(__dirname, '../asset'))
  .then(function (names) {
    console.log('--------------------------------------'.yellow)
    console.log(('[Files in asset directory]').green)
    console.log(names)
    console.log('--------------------------------------\n'.yellow)
  })

try {
  partial.statCustomPartial(__filename)
    .then(function (state) {
      console.log('--------------------------------------'.yellow)
      console.log(('[File state of ' + __filename + ']').green)
      console.log(JSON.stringify(state, null, 2))
      console.log('--------------------------------------\n'.yellow)
    })
} catch (err) {
  console.log('--------------------------------------'.red)
  console.log((err + '').red)
  console.log('--------------------------------------\n'.red)
}

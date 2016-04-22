#!/usr/bin/env node
var path = require('path')
var openSync = require('fs').openSync
var writeSync = require('fs').writeSync

var Promise = require('bluebird')

var colors = require('colors')

/*
 Promise.promisifyAll definition:

 Promise.promisifyAll(
 Object target,
 [Object options {
 suffix: String="Async",
 filter: boolean function(String name, function func, Object target, boolean passesDefaultFilter),
 multiArgs: boolean=false,
 promisifier: function(function originalFunction, function defaultPromisifier)}]
 ) -> Object
 */

function promisifyAllWapper(module, config) {
  var logger = openSync(path.join(__dirname, '../log', config.loggerName), 'w+')
  var log = {}

  var promisifyModule = Promise.promisifyAll(module, {
    suffix: config.suffix,

    /*
     Option: filter is defined as below
     function(name, func, target, passesDefaultFilter) {
     // name = the property name to be promisified without suffix
     // func = the function entity
     // target = the target object where the promisified func will be put with name + suffix
     // passesDefaultFilter = whether the default filter would be passed
     // return boolean (return value is coerced, so not returning anything is same as returning false)

     return passesDefaultFilter && ...}
     })
     */

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
    console.log('Files:'.white)
    console.log(JSON.stringify(names, null, 2).green)
  })

whole.statCustomWhole(__filename)
  .then(function (state) {
    console.log(('[File state of ' + __filename + ']').white)
    console.log(JSON.stringify(state, null, 2).green)
  })

partial.readdirCustomPartial(path.join(__dirname, '../asset'))
  .then(function (names) {
    console.log('Files:'.white)
    console.log(JSON.stringify(names, null, 2).yellow)
  })

try {
  partial.statCustomPartial(__filename)
    .then(function (state) {
      console.log(('[File state of ' + __filename + ']').white)
      console.log(JSON.stringify(state, null, 2).yellow)
    })
} catch (error) {
  console.log(String(error).red)
}

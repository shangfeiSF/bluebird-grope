#!/usr/bin/env node
var path = require('path')

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
  var promisifyModule = Promise.promisifyAll(module, {
    suffix: config.suffix,

    filter: function (name, func, target, passesDefaultFilter) {
      return passesDefaultFilter && config.filter(name)
    },

    /*
     Option: multiArgs
     Setting multiArgs to true means the resulting promise will always fulfill with an array of the callback's success value(s).
     This is needed because promises only support a single success value while some callback API's have multiple success value.
     The default is to ignore all but the first success value of a callback function.
     */
    multiArgs: config.multiArgs || false
  })

  return promisifyModule
}

var multi = promisifyAllWapper(require('fs'), {
  suffix: 'CustomMulti',

  filter: function (name) {
    return true
  },

  multiArgs: true
})

var single = promisifyAllWapper(require('fs'), {
  suffix: 'CustomSingle',

  filter: function (name) {
    return true
  }
})

multi.readdirCustomMulti(path.join(__dirname, '../asset'))
  .then(function (names) {
    console.log('Files:'.white)
    console.log('is Array?', names instanceof Array)
    console.log(JSON.stringify(names, null, 2).green)
  })

multi.statCustomMulti(__filename)
  .then(function (state) {
    console.log(('[File state of ' + __filename + ']').white)
    console.log('is Array?', state instanceof Array)
    console.log(JSON.stringify(state, null, 2).green)
  })

single.readdirCustomSingle(path.join(__dirname, '../asset'))
  .then(function (names) {
    console.log('Files:'.white)
    console.log('is Array?', names instanceof Array)
    console.log(JSON.stringify(names, null, 2).yellow)
  })

single.statCustomSingle(__filename)
  .then(function (state) {
    console.log(('[File state of ' + __filename + ']').white)
    console.log('is Array?', state instanceof Array)
    console.log(JSON.stringify(state, null, 2).yellow)
  })

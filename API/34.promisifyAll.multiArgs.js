#!/usr/bin/env node
var path = require('path')

var Promise = require('bluebird')

var colors = require('colors')

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

// Option: multiArgs
/*
 Setting multiArgs to true means the resulting promise will always fulfill with an array of the callback's success value(s).
 This is needed because promises only support a single success value while some callback API's have multiple success value.
 The default is to ignore all but the first success value of a callback function.
 */

function promisifyAllWapper(module, config) {
  var promisifyModule = Promise.promisifyAll(module, {
    suffix: config.suffix,

    filter: function (name, func, target, passesDefaultFilter) {
      return passesDefaultFilter && config.filter(name)
    },

    multiArgs: config.multiArgs || false
  })

  return promisifyModule
}

var multi = promisifyAllWapper(require('fs'), {
  suffix: 'CustomMulti',

  filter: function (name) {
    return name === 'stat'
  },

  multiArgs: true
})

var rest = promisifyAllWapper(require('fs'), {
  suffix: 'CustomRest',

  filter: function (name) {
    return true
  }
})

try {
  multi.readdirCustomMulti(path.join(__dirname, '../asset'))
    .then(function (names) {
      console.log('--------------------------------------'.yellow)
      console.log(('[isArray?]').green)
      console.log(state instanceof Array)
      console.log(('[Files in asset directory]').green)
      console.log(names)
      console.log('--------------------------------------\n'.yellow)
    })
} catch (err) {
  console.log('--------------------------------------'.red)
  console.log((err + '').red)
  console.log('--------------------------------------\n'.red)
}

multi.statCustomMulti(__filename)
  .then(function (state) {
    console.log('--------------------------------------'.yellow)
    console.log(('[isArray?]').green)
    console.log(state instanceof Array)
    console.log(('[File state of ' + __filename + ']').green)
    console.log(JSON.stringify(state, null, 2))
    console.log('--------------------------------------\n'.yellow)
  })

rest.readdirCustomRest(path.join(__dirname, '../asset'))
  .then(function (names) {
    console.log('--------------------------------------'.yellow)
    console.log(('[isArray?]').green)
    console.log(names instanceof Array)
    console.log(('[Files in asset directory]').green)
    console.log(names)
    console.log('--------------------------------------\n'.yellow)
  })

rest.statCustomRest(__filename)
  .then(function (state) {
    console.log('--------------------------------------'.yellow)
    console.log(('[isArray?]').green)
    console.log(state instanceof Array)
    console.log(('[File state of ' + __filename + ']').green)
    console.log(JSON.stringify(state, null, 2))
    console.log('--------------------------------------\n'.yellow)
  })

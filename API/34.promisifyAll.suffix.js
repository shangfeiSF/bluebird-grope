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
    /*
     Option: suffix is the limits for custom suffices
     (1) Choose the suffix carefully, it must not collide with anything
     (2) PascalCase（also UpperCamelCase） the suffix
     (3) The suffix must be a valid JavaScript identifier using ASCII letters
     (4) Always use the same suffix everywhere in your application（create a wrapper to make this easier）
     */
    suffix: config.suffix
  })

  var _suffix = config.suffix

  promisifyModule._invoke = function (func) {
    return this[func + _suffix]
  }

  console.log('Promise.promisifyAll return:'.white)
  console.log(JSON.stringify(promisifyModule, null, 2).yellow)

  return promisifyModule
}

var fs = promisifyAllWapper(require('fs'), {
  suffix: 'CustomSuffix'
})

fs._invoke('readdir')(path.join(__dirname, '../asset'))
  .then(function (names) {
    console.log('Files:'.white)
    console.log(JSON.stringify(names, null, 2).green)
  })
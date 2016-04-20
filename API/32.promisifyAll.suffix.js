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

// Option: suffix
/*
 The limits for custom suffices:
 （1）Choose the suffix carefully, it must not collide with anything
 （2）PascalCase（also UpperCamelCase） the suffix
 （3）The suffix must be a valid JavaScript identifier using ASCII letters
 （4）Always use the same suffix everywhere in your application（create a wrapper to make this easier）
 */

function promisifyAllWapper(module, config) {
  var promisifyModule = Promise.promisifyAll(module, {
    suffix: config.suffix
  })

  promisifyModule._suffix = config.suffix
  promisifyModule._invoke = function (func) {
    return this[func + this._suffix]
  }

  return promisifyModule
}

var fs = promisifyAllWapper(require('fs'), {
  suffix: 'CustomSuffix'
})

fs._invoke('readdir')(path.join(__dirname, '../asset'))
  .then(function (names) {
    console.log(('[Files is asset directory:]').green)
    console.log(names)
    console.log('--------------------------------------'.green)
  })
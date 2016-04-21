#!/usr/bin/env node
var nopt = require('nopt')
var colors = require('colors')
var Promise = require('./promise')

var options = nopt({
  begin: Boolean,
  next: Boolean
}, {
  'b1': ['--begin', 'true'],
  'b0': ['--begin', 'false'],

  'n1': ['--next', 'true'],
  'n0': ['--next', 'false'],

  'a11': ['--begin', 'true', '--next', 'true'],
  'a00': ['--begin', 'false', '--next', 'false'],
  'a10': ['--begin', 'true', '--next', 'false'],
  'a01': ['--begin', 'false', '--next', 'true'],
}, process.argv, 2)

function begin() {
  console.log('Begin ... '.green)

  var promise = new Promise(function (resolve, reject) {
    setTimeout(function () {
      if (options.begin) {
        resolve(2016)
      } else {
        reject('Failed to execute begin!')
      }
    }, 2000)
  })

  return promise
}

function next(res) {
  console.log(('[Response #1] --- ' + res).yellow)

  var promise = new Promise(function (resolve, reject) {
    setTimeout(function () {
      if (options.next) {
        resolve({
          res: res,
          tag1: 'tag1'
        })
      } else {
        reject('Failed to execute next!')
      }
    }, 2000)
  })

  return promise
}

begin()
  .then(next, function (error) {
    console.log(('[Error] --- ' + error).red)
  })
  .then(
    function (data) {
      console.log(('[Response #2] --- ' + +data.res + '@' + data.tag1).yellow)

      console.log('End'.green)
    },
    function (error) {
      console.log(('[Error] --- ' + error).red)
    }
  )

// $ 06.demo.js -a11
/*
*  Begin ...
* [Response #1] --- 2016
* [Response #2] --- 2016@tag1
* End
* */

// $ 06.demo.js -a00
/*
 *  Begin ...
 *  [Error] --- Failed to execute begin!
 * */

// $ 06.demo.js -a10
/*
 *  Begin ...
 * [Response #1] --- 2016
 * [Error] --- Failed to execute next!
 * */

// $ 06.demo.js -a01
/*
 *  Begin ...
 *  [Error] --- Failed to execute begin!
 * */



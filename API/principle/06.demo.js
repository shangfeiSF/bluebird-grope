#!/usr/bin/env node
var nopt = require('nopt')
var colors = require('colors')
var Promise = require('./promise')

var options = nopt({
  begin: Boolean,
  next: Boolean
}, {
  'bt': ['--begin', 'true'],
  'bf': ['--begin', 'false'],
  'nt': ['--next', 'true'],
  'nf': ['--next', 'false'],
  'ok': ['--begin', 'true', '--next', 'true'],
  'nope': ['--begin', 'false', '--next', 'false'],
  'fh': ['--begin', 'true', '--next', 'false'],
  'sh': ['--begin', 'false', '--next', 'true'],
}, process.argv, 2)

function begin() {
  console.log('Let\'s Begin ... '.green)

  var promise = new Promise(function (resolve, reject) {
    setTimeout(function () {
      if (options.begin) {
        resolve(2016)
      } else {
        reject('Failed to execute begin async!')
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
          tag: 'Promise'
        })
      } else {
        reject('Failed to execute next async!')
      }
    }, 2000)
  }, "next")

  return promise
}

begin()
  .then(next)
  .then(
    function (data) {
      console.log(('[Response #2] --- ' + +data.res + '@' + data.tag).yellow)

      console.log('End'.green)
    },
    function (error) {
      console.log(('[Error] --- ' + error).red)
    }
  )


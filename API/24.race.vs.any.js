#!/usr/bin/env node
var path = require('path')

var Promise = require('bluebird')

var colors = require('colors')

var pormise = [
  Promise.resolve({  // 0
    text: 'OK',
    code: 200
  }),
  Promise.resolve({  // 1
    text: 'Accepted',
    code: 202
  }),
  Promise.reject({  // 2
    text: 'Not Found',
    code: 404
  }),
  Promise.reject({  // 3
    text: 'Bad Gateway',
    code: 502
  })
]

var list = [2, 0, 2, 1, 3]

var Iteration = (function (list) {
  return list.map(function (index) {
    return pormise[index]
  })
})(list)

Promise.race(Iteration)
  .then(function (response) {
    var log = ['race', '---', response.code, '---', response.text].join(' ')
    console.log((log).green)
  })
  .catch(function (error) {
    var log = ['race', '---', error.code, '---', error.text].join(' ')
    console.log((log).red)
  })

Promise.any(Iteration)
  .then(function (response) {
    var log = ['any', '---', response.code, '---', response.text].join(' ')
    console.log((log).green)
  })
  .catch(function (error) {
    var log = ['any', '---', error.code, '---', error.text].join(' ')
    console.log((log).red)
  })

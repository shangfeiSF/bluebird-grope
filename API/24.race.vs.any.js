#!/usr/bin/env node
var path = require('path')

var Promise = require('bluebird')

var nopt = require('nopt')
var colors = require('colors')

var options = nopt({
  fulfilled_count: Number,
  rejected_count: Number
}, {
  'f': ['--fulfilled_count'],

  'f0': ['--fulfilled_count', '0'],
  'f1': ['--fulfilled_count', '1'],
  'f2': ['--fulfilled_count', '2'],

  'r': ['--rejected_count'],

  'r0': ['--rejected_count', '0'],
  'r1': ['--rejected_count', '1'],
  'r2': ['--rejected_count', '2'],
}, process.argv, 2)

var pormise = [
  Promise.resolve({
    text: 'OK',
    code: 200
  }),
  Promise.resolve({
    text: 'Accepted',
    code: 202
  }),
  Promise.reject({
    text: 'Not Found',
    code: 404
  }),
  Promise.reject({
    text: 'Bad Gateway',
    code: 502
  })
]

var resolves = [0, 1].slice(0, options.fulfilled_count)
var rejects = [2, 3].slice(0, options.rejected_count)

var Iteration = (function (resolves, rejects) {
  var resolves = resolves.map(function (index) {
    /* .value() of Promise */
    var value = pormise[index].value()
    var msg = [value.code, value.text].join(' --- ')
    return {
      index: index,
      msg: msg.green,
    }
  })

  var rejects = rejects.map(function (index) {
    /* .reason() of Promise */
    var reason = pormise[index].reason()
    var msg = [reason.code, reason.text].join(' --- ')
    return {
      index: index,
      msg: msg.red
    }
  })

  var sort = resolves.concat(rejects).sort(function () {
    return Math.random() > 0.5 ? -1 : 1
  })

  console.log('promises Iteration:'.white)
  sort.forEach(function (item) {
    console.log(item.msg)
  })

  return sort.map(function (item) {
    return pormise[item.index]
  })
})(resolves, rejects)

/*
 * 'Promise.race will return a promise that is fulfilled or rejected
 * as soon as a promise in the array is fulfilled or rejected
 * with the respective rejection reason or fulfillment value.
 * */
Promise.race(Iteration)
  .then(function (response) {
    console.log('Promise.race return the first fulfilled or rejected:'.white)
    var log = [response.code, '---', response.text].join(' ')
    console.log((log).green)
  })
  .catch(function (error) {
    console.log('Promise.race return the first fulfilled or rejected:'.white)
    var log = [error.code, '---', error.text].join(' ')
    console.log((log).red)
  })

Promise.any(Iteration)
  .then(function (response) {
    console.log('Promise.any return the first fulfilled promise:'.white)
    var log = [response.code, '---', response.text].join(' ')
    console.log((log).green)
  })
  .catch(function (error) {
    console.log('Promise.any return the first fulfilled promise:'.white)
    var log = [error.code, '---', error.text].join(' ')
    console.log((log).red)
  })

if (options.rejected_count > -1 && options.rejected_count < 2) {
  Promise.all(pormise).catch(function (error) {
    // add this Promise.all to avoid some promise which is unhandled cause error
    // console.log(JSON.stringify(error).yellow)

    // 24.race.vs.any.js -f2 -r0
    // 24.race.vs.any.js -f2 -r1
  })
}

/* try several times: */

// 24.race.vs.any.js -f2 -r2
// 24.race.vs.any.js -f2 -r1
// 24.race.vs.any.js -f2 -r0
// 24.race.vs.any.js -f1 -r1
// 24.race.vs.any.js -f0 -r2
// 24.race.vs.any.js -f0 -r1

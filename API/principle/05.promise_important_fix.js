#!/usr/bin/env node
var nopt = require('nopt')

function Promise(asyncFn) {
  var deferreds = []

  var state = 'pending'
  var value = null

  // --- Fixed Important part-1：add a new function handle
  function handle(deferred) {
    if (state === 'pending') {
      deferreds.push(deferred)
      return
    }
    var ret = deferred.onFulfilled(value)
    deferred.resolve(ret)
  }

  // --- Fixed Important part-1

  this.then = function (onFulfilled) {
    // --- Fixed Important part-2：then() will create a bridgePromise
    var promise = new Promise(function (resolve) {
      handle({
        onFulfilled: onFulfilled,
        resolve: resolve
      })
    })
    return promise
    // --- Fixed Important part-2
  }

  function resolve(newValue) {
    // --- Fixed Important part-3：resolve can deal with Promise Object
    if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
      var then = newValue.then
      if (typeof then === 'function') {
        then.call(newValue, resolve)
        return
      }
    }
    // --- Fixed Important part-3

    state = 'fulfilled'
    value = newValue

    setTimeout(function () {
      deferreds.forEach(function (deferred) {
        // --- Fixed Important part-4
        handle(deferred)
        // --- Fixed Important part-4
      })
    }, 0)
  }

  asyncFn(resolve)
}

function begin() {
  var promise = new Promise(function (resolve) {
    if (options.async) {
      console.log('Async....')
      /* async code */
      setTimeout(function () {
        resolve(2016)
      }, 2000)
    } else {
      console.log('Sync....')
      resolve(2016)
    }

  })
  return promise
}

var options = nopt({
  async: Boolean,
  delay: Number
}, {
  'a': ['--async', 'true'],
  's': ['--async', 'false'],
  'd': ['--dalay'],
  'd1': ['--delay', '1000'],
  'd5': ['--delay', '5000']
}, process.argv, 2)

var step_1 = begin()
  .then(function (res) {
    console.log('[Response #1] --- ' + res)

    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve({
          res: res,
          tag1: 'tag1'
        })
      }, 1000)
    })
  })
  .then(function (data) {
    console.log('[Response #2] --- ' + data.res + '@' + data.tag1)

    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve({
          res: data.res,
          tag1: data.tag1,
          tag2: 'tag2',
        })
      }, 1000)
    })
  })

setTimeout(function () {
  step_1.then(function (res) {
    console.log('[Response #3] --- ' + [res.res, '@', res.tag1, '@', res.tag2].join(''))
  })
}, options.delay ? options.delay : 3000)

// 05.promise_important_fix.js -s
/*
 * Sync...
 * [Response #1] --- 2016
 * 1000ms
 * [Response #2] --- 2016@tag1
 * 3000ms
 * [Response #3] --- 2016@tag1@tag2
 * */

// 05.promise_important_fix.js -s -d1
/*
 * Sync...
 * [Response #1] --- 2016
 * 1000ms
 * [Response #2] --- 2016@tag1
 * 1000ms
 * [Response #3] --- 2016@tag1@tag2
 * */

// 05.promise_important_fix.js -s -d5
/*
 * Sync...
 * [Response #1] --- 2016
 * 1000ms
 * [Response #2] --- 2016@tag1
 * 5000ms
 * [Response #3] --- 2016@tag1@tag2
 * */

// 05.promise_important_fix.js -a
/*
 * Async...
 * 2000ms
 * [Response #1] --- 2016
 * 1000ms
 * [Response #2] --- 2016@tag1
 * 3000ms
 * [Response #3] --- 2016@tag1@tag2
 * */

// 05.promise_important_fix.js -a -d1
/*
 * Async...
 * 2000ms
 * [Response #1] --- 2016
 * 1000ms
 * [Response #2] --- 2016@tag1
 * 1000ms
 * [Response #3] --- 2016@tag1@tag2
 * */

// 05.promise_important_fix.js -a -d5
/*
 * Async...
 * 2000ms
 * [Response #1] --- 2016
 * 1000ms
 * [Response #2] --- 2016@tag1
 * 5000ms
 * [Response #3] --- 2016@tag1@tag2
 * */
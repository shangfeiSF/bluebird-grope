#!/usr/bin/env node
var nopt = require('nopt')

function Promise(asyncFn) {
  var deferreds = []

  // --- Fixed 2 part-1：set state and value
  var state = 'pending'
  var value = null
  // -- Fixed 2 part-1

  this.then = function (onFulfilled) {
    // --- Fixed 2 part-2：registered callback to deferreds when state is 'pending'; execute callback(value) when state is 'fulfilled'
    if (state === 'pending') {
      deferreds.push(onFulfilled)
      return this
    }

    onFulfilled(value)
    return this
    // --- Fixed 2 part-2
  }

  function resolve(newValue) {
    // --- Fixed 2 part-3：set state to 'fulfilled' and value to newValue
    state = 'fulfilled'
    value = newValue
    // --- Fixed 2 part-3

    /*
     * Need Fix Important：
     * the value is just the first result of async action, means all of the callbacks in deferreds will get the same value
     * but callback need get the result returned by its nearest async action before(see details in Promise/A+ criterion)
     */
    setTimeout(function () {
      deferreds.forEach(function (deferred) {
        deferred(value)
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
  /* this callback can be registered into deferreds */
  .then(function (res) {
    console.log('[Response #1] --- ' + res)
  })
  /* this callback also can be registered into deferreds */
  .then(function (res) {
    console.log('[Response #2] --- ' + res)
  })

setTimeout(function () {
  step_1.then(function (res) {
    console.log('[Response #3] --- ' + res)
  })
}, options.delay ? options.delay : 3000)

// 04.promise_2_fixed.js -s
// 04.promise_2_fixed.js -s -d1
// 04.promise_2_fixed.js -s -d5

// 04.promise_2_fixed.js -a
// 04.promise_2_fixed.js -a -d1
// 04.promise_2_fixed.js -a -d5
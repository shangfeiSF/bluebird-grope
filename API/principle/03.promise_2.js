#!/usr/bin/env node
var nopt = require('nopt')

function Promise(asyncFn) {
  var deferreds = []

  this.then = function (onFulfilled) {
    deferreds.push(onFulfilled)
    return this
  }

  function resolve(value) {
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
  /*
  * Need Fix 2：
  * try to register another callback into deferreds after 3000ms(line 77)
  * actually this callback is just registered into deferreds
  * but iterating the deferreds has been occured 2000ms(line 35)
  * so this callback will not be executed by default
  * */
  step_1.then(function (res) {
    console.log('[Response #3] --- ' + res)
  })
}, options.delay ? options.delay : 3000)

// 03.promise_2.js -s
// 03.promise_2.js -s -d1
// 03.promise_2.js -s -d5

// 03.promise_2.js -a
// 03.promise_2.js -a -d1
// 03.promise_2.js -a -d5


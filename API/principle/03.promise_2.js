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
     Need Fix Important：
     只是基于第一次的异步返回结果离散处理 value
     不是PromiseA+规范中连续then的需求
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
      /* 异步代码 */
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

/* begin()后立即执行 then 可以注册回调到 deferreds */
var step_1 = begin()
  .then(function (res) {
    console.log('[Response #1] --- ' + res)
  })
  .then(function (res) {
    console.log('[Response #2] --- ' + res)
  })

setTimeout(function () {
  /*
   Need Fix 2：
   5000ms 后再次执行 then 虽然可以注册回调到 deferreds
   但是在 2000ms 时已经执行 deferreds 遍历执行
   之后的动作只是注册，但是不会被执行
   同步代码更是无法执行到后续的动作
   */
  step_1.then(function (res) {
    console.log('[Response #3] --- ' + res)
  })
}, options.delay ? options.delay : 1000)

// 03.promise_2.js -s
// 03.promise_2.js -s -d1000
// 03.promise_2.js -s -d5000

// 03.promise_2.js -a
// 03.promise_2.js -a -d1000
// 03.promise_2.js -a -d5000


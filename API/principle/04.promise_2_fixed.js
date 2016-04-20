#!/usr/bin/env node
var nopt = require('nopt')

function Promise(asyncFn) {
  var deferreds = []

  // ---Has Fix 2 part-1：引入状态state 和 私有变量 value
  var state = 'pending'
  var value = null
  // ---Has Fix 2 part-1

  this.then = function (onFulfilled) {
    // ---Has Fix 2 part-2：检查 state 为 pending 时注册到 deferreds；为 fulfilled 时直接执行 onFulfilled(value)
    if (state === 'pending') {
      deferreds.push(onFulfilled)
      return this
    }

    onFulfilled(value)
    return this
    // ---Has Fix 2 part-2
  }

  function resolve(newValue) {
    // ---Has Fix 2 part-3：异步成功后 state 置为 fulfilled 私有变量 value = newValue
    state = 'fulfilled'
    value = newValue
    // ---Has Fix 2 part-3

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

var step_1 = begin()
  .then(function (res) {
    console.log('[Response #1] --- ' + res)
  })
  .then(function (res) {
    console.log('[Response #2] --- ' + res)
  })

setTimeout(function () {
  step_1.then(function (res) {
    console.log('[Response #3] --- ' + res)
  })
}, options.delay ? options.delay : 1000)

// 04.promise_2_fixed.js -s
// 04.promise_2_fixed.js -s -d1000
// 04.promise_2_fixed.js -s -d5000

// 04.promise_2_fixed.js -a
// 04.promise_2_fixed.js -a -d1000
// 04.promise_2_fixed.js -a -d5000
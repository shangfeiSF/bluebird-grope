#!/usr/bin/env node
var nopt = require('nopt')

function Promise(asyncFn) {
  var deferreds = []

  var state = 'pending'
  var value = null

  // ---Has fix Important part-1：新增一个 handle 方法
  function handle(deferred) {
    if (state === 'pending') {
      deferreds.push(deferred)
      return
    }
    var ret = deferred.onFulfilled(value)
    deferred.resolve(ret)
  }
  // ---Has fix Important part-1

  this.then = function (onFulfilled) {
    // ---Has fix Important part-2：then 方法创建一个 bridgePromise
    var promise = new Promise(function (resolve) {
      handle({
        onFulfilled: onFulfilled,
        resolve: resolve
      })
    })
    return promise
    // ---Has fix Important part-2
  }

  function resolve(newValue) {
    // ---Has fix Important part-3：resolve 支持处理 Promise 对象
    if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
      var then = newValue.then
      if (typeof then === 'function') {
        then.call(newValue, resolve)
        return
      }
    }
    // ---Has fix Important part-3

    state = 'fulfilled'
    value = newValue

    setTimeout(function () {
      deferreds.forEach(function (deferred) {
        // ---Has fix Important part-4
        handle(deferred)
        // ---Has fix Important part-4
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

    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve({
          res: res,
          tag: 'Promise'
        })
      }, 5000)
    })
  })
  .then(function (data) {
    console.log('[Response #2] --- ' + data.res + '@' + data.tag)

    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve({
          res: data.res,
          tag: data.tag,
          delay: options.delay || 1000
        })
      }, 5000)
    })
  })

setTimeout(function () {
  step_1.then(function (res) {
    console.log('[Response #3] --- ' + JSON.stringify(res, null, 2))
  })
}, options.delay ? options.delay : 1000)

#!/usr/bin/env node
var nopt = require('nopt')

function Promise(asyncFn) {
  /* deferreds 是延迟执行的队列 */
  var deferreds = []

  /* then 是将异步执行成功后的回调注册到 deferreds */
  this.then = function (onFulfilled) {
    deferreds.push(onFulfilled)
    /* 支持链式的 .then().then() */
    return this
  }

  function resolve(value) {
    /*
     Need Fix Important：
     只是基于第一次的异步返回结果离散处理 value
     不是PromiseA+规范中连续then的需求
     */
    deferreds.forEach(function (deferred) {
      deferred(value)
    })
  }

  /* asyncFn 是 new Promise 实例时执行的异步方法 */
  /* resolve 是异步方法执行成功时调用的方法 */
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
      /*
       Need Fix 1：
       同步代码, 有严重的问题：begin之后通过 then 注册到 deferreds 实际上还未执行
       同步执行到 resolve(2016) 后 deferreds 是空
       */
      resolve(2016)
    }
  })
  return promise
}

var options = nopt({
  async: Boolean
}, {
  'a': ['--async', 'true'],
  's': ['--async', 'false']
}, process.argv, 2)

begin()
  .then(function (res) {
    console.log('[Response #1] --- ' + res)
  })
  .then(function (res) {
    console.log('[Response #2] --- ' + res)
  })
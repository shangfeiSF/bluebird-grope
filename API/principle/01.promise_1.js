#!/usr/bin/env node
var nopt = require('nopt')

function Promise(asyncFn) {
  /* deferreds will store the callbacks which registered with then() */
  var deferreds = []

  /* using then() to register the callback into the promise (actually into the deferreds) */
  this.then = function (onFulfilled) {
    deferreds.push(onFulfilled)
    /* returning this will support the chain of using then() */
    return this
  }

  function resolve(value) {
    /*
     * Need Fix Important：
     * the value is just the first result of async action, means all of the callbacks in deferreds will get the same value
     * but callback need get the result returned by its nearest async action before(see details in Promise/A+ criterion)
     */
    deferreds.forEach(function (deferred) {
      deferred(value)
    })
  }

  /* asyncFn will be executed when new Promise */
  /* resolve will be executed when asyncFn completed successfully */
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
      /*
      * Need Fix 1：
      * sync code is invalid, the callbacks that expected to be registered into deferreds have not been registered
      * deferreds is empty when excuting resolve(2016)
      * */
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
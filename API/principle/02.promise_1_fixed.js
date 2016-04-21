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
    setTimeout(function () {
      deferreds.forEach(function (deferred) {
        deferred(value)
      })
    }, 0)
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
      * Fixed 1：
      * using setTimeout and setting timeout to 0
      * this will delay iterating the deferreds util all the sync code executed
      * offer the opportunity for then() to register the callback to deferreds
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
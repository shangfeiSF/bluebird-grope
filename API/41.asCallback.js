#!/usr/bin/env node
var path = require('path')

var Promise = require('bluebird')
var fs = Promise.promisifyAll(require("fs"))

var nopt = require('nopt')
var colors = require('colors')

function Query() {
  this.version = function () {
    return '0.1'
  }
  this.author = 'shangfeiSF'

  this.options = nopt({
    basename: Boolean,
    extname: Boolean,
    dirname: Boolean,
    root: Boolean
  }, {
    'b': ['--basename'],
    'b1': ['--basename', 'true'],
    'b0': ['--basename', 'false'],

    'e': ['--extname'],
    'e1': ['--extname', 'true'],
    'e0': ['--extname', 'false'],

    'd': ['--dirname'],
    'd1': ['--dirname', 'true'],
    'd0': ['--dirname', 'false'],

    'r': ['--root'],
    'r1': ['--root', 'true'],
    'r0': ['--root', 'false']
  }, process.argv, 2)
}

Query.prototype.basename = function (name, callback) {
  var self = this

  var basename = path.basename(name)
  var option = self.options.hasOwnProperty('basename') ? self.options.basename : true

  setTimeout(function () {
    if (option) {
      callback(null, basename, self.version())
    } else {
      callback(new Error('basename is failed'))
    }
  }, 2000)
}

Query.prototype.extname = function (name, callback) {
  var self = this

  var extname = path.extname(name)
  var option = self.options.hasOwnProperty('extname') ? self.options.extname : true

  setTimeout(function () {
    if (option) {
      callback(null, extname, self.version())
    } else {
      callback(new Error('extname is failed'))
    }
  }, 2000)
}

Query.prototype.dirname = function (name, callback) {
  var self = this

  var dirname = path.dirname(name)
  var option = self.options.hasOwnProperty('dirname') ? self.options.dirname : true

  setTimeout(function () {
    if (option) {
      callback(null, dirname, self.version())
    } else {
      callback(new Error('dirname is failed'))
    }
  }, 2000)
}

Query.prototype.root = function (name, callback) {
  var self = this

  var root = path.parse(name).root
  var option = self.options.hasOwnProperty('root') ? self.options.root : true

  setTimeout(function () {
    if (option) {
      callback(null, root, self.version())
    } else {
      callback(new Error('root is failed'))
    }
  }, 2000)
}

var query = new Query()

// promise return an array
var basenameCustom = Promise.promisify(query.basename, {
  context: query,
  multiArgs: true
})

// promise return an array
var extnameCustom = Promise.promisify(query.extname, {
  context: query,
  multiArgs: true
})

// promise return a value
var dirnameCustom = Promise.promisify(query.dirname, {
  context: query
})

// promise return a value
var rootCustom = Promise.promisify(query.root, {
  context: query
})

/*
 Register a node-style callback on this promise.

 When this promise is either fulfilled or rejected,
 the node callback will be called back with the node.js habit
 means error reason is the first argument and success value is the second argument.

 The error argument will be null in case of success.

 Returns back this promise instead of creating a new one.
 If the callback argument is not a function, this method does not do anything.

 This can be used to create APIs that both accept node-style callbacks and return promises:
 */

// success
basenameCustom(__filename)
  .asCallback(function (error, result) {
    // asCallback is the same as a middleware to deal with error and result
    if (error) {
      // sync code is worked
      console.log('\nbasenameCustom-asCallback-error'.yellow)
      error.specs = 'asCallback deal with error sync!'
    } else {
      // sync code is worked
      console.log('\nbasenameCustom-asCallback-result'.yellow)
      result.push('asCallback deal with result sync!')
    }
  })
  .then(function (result) {
    console.log('\nbasenameCustom:'.green)
    console.log('is Array?', result instanceof Array)

    console.log(('basename version:').green)
    console.log(JSON.stringify(result, null, 2))
  }, function (error) {
    console.log('\n' + JSON.stringify(error, null, 2).magenta)
  })

// failed
extnameCustom(__filename)
  .asCallback(function (error, result) {
    // asCallback is the same as a middleware to deal with error and result
    if (error) {
      // async code is worked, but no use to error that asCallback returned
      fs.statAsync(__filename)
        .then(function (stat) {
          console.log('\nextnameCustom-asCallback-error'.yellow)
          error.specs = stat.size
        })
    } else {
      // async code is worked, but no use to error that asCallback returned
      fs.statAsync(__filename)
        .then(function (stat) {
          console.log('\nextnameCustom-asCallback-result'.yellow)
          result.push(stat.size)
        })
    }
  })
  .then(function (result) {
    console.log('\nextnameCustom:'.green)
    console.log('is Array?', result instanceof Array)

    console.log(('extname version:').green)
    console.log(JSON.stringify(result, null, 2))
  }, function (error) {
    console.log('\n' + JSON.stringify(error, null, 2).magenta)
  })

// failed
dirnameCustom(__filename)
  .asCallback(function (error, result) {
    // asCallback is the same as a middleware to deal with error and result
    if (error) {
      // sync code is worked
      console.log('\ndirnameCustom-asCallback-error'.yellow)
      error = new Error('asCallback deal with error sync!')
    } else {
      // sync code is worked
      console.log('\ndirnameCustom-asCallback-result'.yellow)
      result = 'asCallback deal with result sync!'
    }
  })
  .then(function (result) {
    console.log('\ndirnameCustom:'.green)
    console.log('is Array?', result instanceof Array)

    console.log(('dirname version:').green)
    console.log(JSON.stringify(result, null, 2))
  }, function (error) {
    console.log('\n' + JSON.stringify(error, null, 2).magenta)
  })

// failed
rootCustom(__filename)
  .asCallback(function (error, result) {
    // asCallback is the same as a middleware to deal with error and result
    if (error) {
      // async code is worked, but no use to error that asCallback returned
      fs.statAsync(__filename)
        .then(function (stat) {
          console.log('\nrootCustom-asCallback-error'.yellow)
          error = new Error(stat.size)
        })
    } else {
      // async code is worked, but no use to error that asCallback returned
      fs.statAsync(__filename)
        .then(function (stat) {
          console.log('\nrootCustom-asCallback-result'.yellow)
          result = stat.size
        })
    }
  })
  .then(function (result) {
    console.log('\nrootCustom:'.green)
    console.log('is Array?', result instanceof Array)

    console.log(('root version:').green)
    console.log(JSON.stringify(result, null, 2))
  }, function (error) {
    console.log('\n' + JSON.stringify(error, null, 2).magenta)
  })

// sync code and async code to add property to error or push a new item to result
// both code is executed, but sync code is successful, while async is failed
// 41.asCallback.js -b1 -e1
// 41.asCallback.js -b0 -e0

// sync code and async code to rewrite the value of error or result
// both code is executed, but sync code and async code are failed
// 41.asCallback.js -d1 -r1
// 41.asCallback.js -d0 -r0

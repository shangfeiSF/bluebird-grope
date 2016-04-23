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
    root: Boolean,
    convert: Boolean
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
    'r0': ['--root', 'false'],

    'c': ['--convert'],
    'c1': ['--convert', 'true'],
    'c0': ['--convert', 'false']
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

Query.prototype.convert = function (data, callback) {
  var self = this

  var obj = {data: data}
  var option = self.options.hasOwnProperty('convert') ? self.options.convert : true

  setTimeout(function () {
    if (option) {
      callback(null, obj, self.author)
    } else {
      callback(new Error('convert is failed'))
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

basenameCustom(__filename)
  .then(function (result) {
    console.log('\nbasenameCustom:'.green)
    console.log('is Array?', result instanceof Array)

    console.log(('basename version:').green)
    console.log(JSON.stringify(result, null, 2))

    // Returns a promise that is resolved by a node style callback function.
    return Promise.fromCallback(function (callback) {
        return query.convert(result, callback)
      }, {
        multiArgs: true
      })
      .then(function (info) {
        console.log('\nbasenameCustom fromCallback:'.yellow)
        console.log('is Array?', info instanceof Array)

        console.log(('data author:').yellow)
        console.log(JSON.stringify(info, null, 2))
      }, function (error) {
        console.log('\n' + String(error).red)
      })
  }, function (error) {
    console.log('\n' + String(error).magenta)
  })

extnameCustom(__filename)
  .then(function (result) {
    console.log('\nextnameCustom:'.green)
    console.log('is Array?', result instanceof Array)

    console.log(('extname version:').green)
    console.log(JSON.stringify(result, null, 2))

    return Promise.fromCallback(function (callback) {
        return query.convert(result, callback)
      })
      .then(function (info) {
        console.log('\nextnameCustom fromCallback:'.yellow)
        console.log('is Array?', info instanceof Array)

        console.log(('data author:').yellow)
        console.log(JSON.stringify(info, null, 2))
      }, function (error) {
        console.log('\n' + String(error).red)
      })
  }, function (error) {
    console.log('\n' + String(error).magenta)
  })

dirnameCustom(__filename)
  .then(function (result) {
    console.log('\ndirnameCustom:'.green)
    console.log('is Array?', result instanceof Array)

    console.log(('dirname version:').green)
    console.log(JSON.stringify(result, null, 2))

    // written more concisely with Function.prototype.bind
    return Promise.fromCallback(query.convert.bind(query, result), {
        multiArgs: true
      })
      .then(function (info) {
        console.log('\ndirnameCustom fromCallback:'.yellow)
        console.log('is Array?', info instanceof Array)

        console.log(('data author:').yellow)
        console.log(JSON.stringify(info, null, 2))
      }, function (error) {
        console.log('\n' + String(error).red)
      })
  }, function (error) {
    console.log('\n' + String(error).magenta)
  })

rootCustom(__filename)
  .then(function (result) {
    console.log('\nrootCustom:'.green)
    console.log('is Array?', result instanceof Array)

    console.log(('root version:').green)
    console.log(JSON.stringify(result, null, 2))

    // written more concisely with Function.prototype.bind
    return Promise.fromCallback(query.convert.bind(query, result))
      .then(function (info) {
        console.log('\nrootCustom fromCallback:'.yellow)
        console.log('is Array?', info instanceof Array)

        console.log(('data author:').yellow)
        console.log(JSON.stringify(info, null, 2))
      }, function (error) {
        console.log('\n' + String(error).red)
      })
  }, function (error) {
    console.log('\n' + String(error).magenta)
  })
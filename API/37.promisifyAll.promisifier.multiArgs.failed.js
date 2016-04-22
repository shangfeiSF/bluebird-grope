#!/usr/bin/env node
var path = require('path')

var Promise = require('bluebird')

var nopt = require('nopt')
var colors = require('colors')

function Search() {
  this.version = function () {
    return '0.1.0'
  }
  this.author = 'yuncong'

  this.options = nopt({
    basename: Boolean,
    extname: Boolean,
    dirname: Boolean,
    multiArgs: Boolean,
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
    'm': ['--multiArgs'],
    'm1': ['--multiArgs', 'true'],
    'm0': ['--multiArgs', 'false']
  }, process.argv, 2)
}

Search.prototype.getBasename = function (filename, onsuccess, onerror) {
  var self = this
  var basename = path.basename(filename)
  var option = self.options.hasOwnProperty('basename') ? self.options.basename : true

  setTimeout(function () {
    if (option) {
      onsuccess([basename, self.version(), self.author])
    } else {
      onerror(new Error('getBasename is failed'))
    }
  }, 2000)
}

Search.prototype.getExtname = function (filename, onsuccess, onerror) {
  var self = this
  var extname = path.extname(filename)
  var option = self.options.hasOwnProperty('extname') ? self.options.extname : true

  setTimeout(function () {
    if (option) {
      onsuccess(extname, self.version(), self.author)
    } else {
      onerror(new Error('getExtname is failed'))
    }
  }, 2000)
}

Search.prototype.getDirname = function (filename, onsuccess, onerror) {
  var self = this
  var dirname = path.dirname(filename)
  var option = self.options.hasOwnProperty('dirname') ? self.options.dirname : true

  setTimeout(function () {
    if (option) {
      onsuccess([dirname, self.version(), self.author])
    } else {
      onerror(new Error('getDirname is failed'))
    }
  }, 2000)
}

var search = new Search()

// Promise.promisifyAll 的函数原型：
/*
 Promise.promisifyAll(
 Object target,
 [Object options {
 suffix: String="Async",
 filter: boolean function(String name, function func, Object target, boolean passesDefaultFilter),
 multiArgs: boolean=false,
 promisifier: function(function originalFunction, function defaultPromisifier)}]
 ) -> Object
 */

// Option: promisifier
/*
 Optionally, you can define a custom promisifier,
 so you could promisifyAll e.g. the chrome APIs used in Chrome extensions.
 The promisifier gets a reference to the original method ,
 and should return a function which returns a promise.
 */

function promisifyAllWapper(module, config) {
  var promisifyModule = Promise.promisifyAll(module, {
    suffix: config.suffix,

    filter: function (name, func, target, passesDefaultFilter) {
      return passesDefaultFilter && config.filter(name)
    },

    multiArgs: config.multiArgs || false,

    promisifier: config.promisifier
  })

  return promisifyModule
}

var partial = promisifyAllWapper(search, {
  suffix: 'CustomPartial',

  filter: function (name) {
    return name === 'getExtname' || name === 'getDirname'
  },

  multiArgs: search.options.multiArgs || false, // multiArgs 无法影响 search 中方法的promise返回值

  promisifier: function (originalMethod, defaultPromisifier) {
    return function () {
      // return an anonymous function
      var args = [].slice.call(arguments)
      // Needed so that the original method can be called with the correct context
      // 例如：getBasename中self.options self.version()都需要正确的上线文对象， 与Promise.promisify的context配置是一样的作用
      var self = this

      // this anonymous function need return a promise
      return new Promise(function (resolve, reject) {
        args.push(resolve, reject)
        return originalMethod.apply(self, args)
      })
    }
  }
})

try {
  partial.getBasenameCustomPartial(__filename)
    .then(function (result) {
      console.log('--------------------------------------'.green)
      console.log(('[isArray?]').green)
      console.log(result instanceof Array)
      console.log(('[Basename version author').green)
      console.log(result)
      console.log('--------------------------------------\n'.green)
    }, function (err) {
      console.log('--------------------------------------'.yellow)
      console.log((err + '').yellow)
      console.log('--------------------------------------\n'.yellow)
    })
} catch (err) {
  console.log('--------------------------------------'.red)
  console.log((err + '').red)
  console.log('--------------------------------------\n'.red)
}

try {
  partial.getExtnameCustomPartial(__filename)
    .then(function (result) {
      console.log('--------------------------------------'.green)
      console.log(('[isArray?]').green)
      console.log(result instanceof Array)
      console.log(('[Extname version author]').green)
      console.log(result)
      console.log('--------------------------------------\n'.green)
    }, function (err) {
      console.log('--------------------------------------'.yellow)
      console.log((err + '').yellow)
      console.log('--------------------------------------\n'.yellow)
    })
} catch (err) {
  console.log('--------------------------------------'.red)
  console.log((err + '').red)
  console.log('--------------------------------------\n'.red)
}

try {
  partial.getDirnameCustomPartial(__filename)
    .then(function (result) {
      console.log('--------------------------------------'.green)
      console.log(('[isArray?]').green)
      console.log(result instanceof Array)
      console.log(('[Dirname version author]').green)
      console.log(result)
      console.log('--------------------------------------\n'.green)
    }, function (err) {
      console.log('--------------------------------------'.yellow)
      console.log((err + '').yellow)
      console.log('--------------------------------------\n'.yellow)
    })
} catch (err) {
  console.log('--------------------------------------'.red)
  console.log((err + '').red)
  console.log('--------------------------------------\n'.red)
}
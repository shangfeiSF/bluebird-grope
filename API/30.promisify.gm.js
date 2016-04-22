#!/usr/bin/env node
var path = require('path')

var Promise = require('bluebird')
var fs = Promise.promisifyAll(require("fs"))

var gm = require('gm')
var colors = require('colors')

// gm instance has these getters
var getters = ["size", "identify", "format", "depth", "color", "res", "filesize"]

function Getters(name) {
  var imagePath = path.join(__dirname, '../asset', name)
  // create the gm instance by imagePath
  var instance = gm(imagePath)

  // iterate all the getters of instance
  return Promise.reduce(getters, function (census, getter) {
      /* Promise.promisify the getter of instance*/
      var asyncGetter = Promise.promisify(instance[getter], {
        // set the context important！
        context: instance
      })

      return asyncGetter().then(function (result) {
        // restore the result of asyncGetter into census
        census[getter] = result
        return census
      })
    }, {})
    .then(function (census) {
      var data = JSON.stringify({census: census}, null, 2)

      // log census into json file
      return fs.writeFileAsync('../log/30.promisify.gm.json', data, {
        encoding: 'utf-8',
        flag: 'w+'
      }).return(census)
    })
}

new Getters('30.promisify.gm.jpg')
  .then(function (census) {
    var data = JSON.stringify({census: census}, null, 2)

    console.log(data.green)
  })
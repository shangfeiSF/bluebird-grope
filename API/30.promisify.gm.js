#!/usr/bin/env node
var path = require('path')

var Promise = require('bluebird')
var fs = Promise.promisifyAll(require("fs"))

var colors = require('colors')
var gm = require('gm')

var common = require('./00.common')

var getters = ["size", "identify", "format", "depth", "color", "res", "filesize"]

function Getters(name) {
  var imagePath = path.join(__dirname, '../asset', name)
  var context = gm(imagePath)

  return Promise.reduce(getters, function (census, getter) {
      var async = Promise.promisify(context[getter], {
        context: context
      })

      return async().then(function (result) {
        census[getter] = result
        return census
      })
    }, {})
    .then(function (census) {
      var data = JSON.stringify({census: census}, null, 2)
      return fs.writeFileAsync('../log/30.promisify.gm.json', data, {encoding: 'utf-8', flag: 'w+'}).return(census)
    })
}

new Getters('30.promisify.gm.jpg')
  .then(function (census) {
    var data = JSON.stringify({census: census}, null, 2)
    console.log((data).green)
  })
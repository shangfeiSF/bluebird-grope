var Promise = require('bluebird')
var fs = Promise.promisifyAll(require("fs"));
var join = Promise.join;

var files = []
var seq = 1
function timeStamp() {
  var date = new Date()
  var stampfn = ["getHours", "getMinutes", "getSeconds", "getMilliseconds"]
  var timestamp = []
  stampfn.forEach(function (value, index, array) {
    timestamp.push(date[value]())
  })
  return timestamp.join(":")
}

/*fs.readdirAsync(".").then(function (fss) {
 console.log("current directory includes:")
 fss.map(function (value, index, array) {
 console.log(timeStamp() + "---fileIndex---" + index + "---fileName---" + value)
 })
 //这里then方法自动返回Promise对象(包含fss数组)
 return fss
 }).map(function (fileName) {
 var stat = fs.statAsync(fileName);
 var contents = fs.readFileAsync(fileName).catch(function ignore() {
 });
 //then方法自动返回Promise对象(包含一个map返回的数组)
 //map返回一个数组，元素是join方法处理stat和contents的object
 return join(stat, contents, function (stat, contents) {
 files.push({
 stat: stat,
 fileName: fileName,
 contents: contents
 })
 return {
 stat: stat,
 fileName: fileName,
 contents: contents
 }
 });
 }).then(function (data) {
 console.log("------Promise.settle(data)------")
 console.log(Promise.settle(data))
 console.log("------Promise.settle(data).isFulfilled------")
 console.log(Promise.settle(data).isFulfilled())
 console.log("------data.pop()------")
 console.log(data.pop())
 return data
 }).call("sort", function (a, b) {
 return a.fileName.localeCompare(b.fileName);
 }).then(function (data) {
 data.forEach(function (value, index, array) {
 var contentLength = value.stat.isDirectory() ? "(directory)" : value.contents.length + " bytes";
 console.log(value.fileName + "---size---" + contentLength)
 })
 })*/

// some&spread&settle method:
// Promise.some([fs.statAsync("app.js"), fs.statAsync("app-1.js"),fs.statAsync("package.json")], 2).spread(function(file1s, file2s){
//     console.log(file1s.ctime)
//     console.log(file2s.ctime)
// }).catch(function(){
//     console.log("num is unarrival!!")
// })

/*fs.readdirAsync(".").then(function(fss){
 console.log("current directory includes:")
 fss.map(function(value, index, array){
 console.log("fileIndex---"+ index + "---fileName---" +  value)
 })
 return fss
 }).then(function(fss){
 var pattern = /\.js|\.json/gi
 var accord_files = []
 fss.map(function(value, index, array){
 if(pattern.test(value)){
 accord_files.push(value)
 }
 })
 console.log(accord_files)
 return accord_files
 }).call("filter", function(value, index, array){
 var pattern = /app/gi
 return pattern.test(value)
 }).then(function(data){
 console.log("according app files is below:")
 return data
 }).map(function(file){
 console.log(file)
 var stat = fs.statAsync(file);
 //when coordinating multiple and fixed amount concurrent discrete promises,it is better to use .join method
 //another case is that we need other data together
 return join(stat, file, function(stat, file) {
 return {
 stat: stat,
 name: file
 }
 });
 }).then(function(data){
 console.log(Promise.settle(data).value())
 return Promise.some(data, 1)
 }).spread(function(f0){
 console.log(f0.name + "---size---" + f0.stat.size)
 }).catch(function(e){
 console.log(e)
 })*/

// finally method:
// change the file name to test.json or test-1.json:
// case test.json will console "file contains invalid json"
// case test-1.json will console  "unable to read file, because: ……"
// but in all case it will finally console "This is the console in finally!!!"

/*fs.readFileAsync("package.json").then(JSON.parse).then(function (json) {
 console.log("Successful json:")
 console.log(json)
 }).catch(SyntaxError, function (e) {
 console.error("file contains invalid json");
 }).error(function (e) {
 console.error("unable to read file, because: ", e.message);
 }).finally(function(){
 console.log("This is the console in finally!!!")
 })*/

// bind method

fs.readdirAsync(".").map(function (file) {
  var stat = fs.statAsync(file);
  return join(stat, file, function (stat, file) {
    return {
      stat: stat,
      file: file
    }
  })
}).then(function (data) {
  return Promise.some(data, 2)
}).bind({}).spread(function (aValue, bValue) {
    this.aValue = aValue;
    this.bValue = bValue;
    console.log(this)
    return this
  })
  .then(function (data) {
    console.log(this.aValue.stat.size + "---" + this.bValue.stat.size)
  });

// resolve method:

/*Promise.resolve([{
 name: "test-object",
 value: "xiaoshao"
 },{
 name: "alibaba",
 value: "shangfei"
 }
 ]).then(function(data) {
 console.log(data)
 console.log(Promise.settle(data).isFulfilled())
 }).catch(function(e) {
 console.log(e);
 });*/

// reject method
//change reject to resolve: console change from "Fulfilled---" to "Rejected---""

/*Promise.reject({
 name: "reason-1",
 value: "why"
 }).then(function(data){
 console.log("Fulfilled---")
 }, function(data){
 console.log("Rejected---")
 }).catch(function(e) {
 console.log(e);
 });*/

//isFulfilled&value&isRejected&reason method:

/*console.log(Promise.resolve([{
 name: "test-object",
 value: "xiaoshao"
 },{
 name: "alibaba",
 value: "shangfei"
 }
 ]).isFulfilled())
 console.log(Promise.resolve([{
 name: "test-object",
 value: "xiaoshao"
 },{
 name: "alibaba",
 value: "shangfei"
 }
 ]).value())
 console.log(Promise.reject("this is reject method").isRejected())
 console.log(Promise.reject("this is reject method").reason())*/

//props method:

/*Promise.props({
 img: Promise.resolve({
 url: "this is url",
 name: "this is name"
 }),
 seller: Promise.resolve({
 sell: 20,
 rank: 5
 }),
 //change "reject" to "resolve" can see console
 test: Promise.reject("this is reject method")
 }).then(function(data){
 console.log(data.img.name + "---" + data.seller.rank + "---" + data.test);
 })*/

//any&race method:

/*
 var data = [
 Promise.reject({
 url: "this is url",
 name: "this is name"
 }),
 Promise.reject({
 sell: 20,
 rank: 5
 }),
 Promise.resolve({
 year: 2014,
 month: 7,
 day: 24
 })]
 // change any to race will see console change
 Promise.any(data).then(function (data) {
 console.log(data)
 }).catch(function (e) {
 console.log(e)
 })
 */

//map option: concurrency, control concurrency amount

/*
var concurrency = parseFloat(process.argv[2] || "Infinity");

console.time("reading files");

fs.readdirAsync(".")
  .map(function (fileName) {
    console.log(fileName)
    var stat = fs.statAsync(fileName);
    var contents = fs.readFileAsync(fileName).catch(function ignore() {
    });
    return join(stat, contents, function (stat, contents) {
      return {
        stat: stat,
        fileName: fileName,
        contents: contents
      }
    });
  }, {concurrency: concurrency})
  .then(function (data) {
    console.log('-------------------------')
    data.forEach(function(item){
      console.log(item.fileName)
    })
    console.log('-------------------------')
    console.timeEnd("reading files");
  });
*/

//reduce method:

/*Promise.reduce(["test-reduce-1.json", "test-reduce-2.json", "test-reduce-3.json"], function(total, fileName) {
 return fs.readFileAsync(fileName, "utf8").then(function(contents) {
 return total + parseInt(contents, 10);
 });
 }, 100).then(function(total) {
 console.log(total)
 });*/


// promisify method:

/*var request = Promise.promisify(require('request'));
 request("http://www.baidu.com").spread(function(response, body) {
 console.log(body);
 }).catch(function(err) {
 console.error(err);
 });*/


// .return()

/*var fs = Promise.promisifyAll(require("fs"));
var baseDir = process.argv[2] || ".";

function writeFile(path, contents) {
  var fullpath = require("path").join(baseDir, path);
  return fs.writeFileAsync(fullpath, contents).then(function () {
    var data = "test"
    console.log(data)
  }).return(fullpath);
}

writeFile("text.txt", "this is text-11").then(function (fullPath) {
  console.log("Successfully file at: " + fullPath);
})*/

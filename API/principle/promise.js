module.exports = function (asyncFn) {
  var state = 'pending'
  var value = null
  var deferreds = []

  this.then = function (onFulfilled, onRejected) {
    var promise = new Promise(function (resolve, reject) {
      handle({
        onFulfilled: onFulfilled || null,
        onRejected: onRejected || null,
        resolve: resolve,
        reject: reject
      })
    })
    return promise
  }

  function resolve(result) {
    if (result && (typeof result === 'object' || typeof result === 'function')) {
      var then = result.then
      if (then && typeof then === 'function') {
        then.call(result, resolve, reject)
        return
      }
    }
    state = 'fulfilled'
    value = result
    finale()
  }

  function reject(reason) {
    state = 'rejected'
    value = reason
    finale()
  }

  function handle(deferred) {
    if (state === 'pending') {
      deferreds.push(deferred)
      return
    }

    var callback = state === 'fulfilled' ? deferred.onFulfilled : deferred.onRejected

    if (callback === null) {
      callback = state === 'fulfilled' ? deferred.resolve : deferred.reject
      callback(value)
      return
    }

    var _promise = callback(value)
    deferred.resolve(_promise)
  }

  function finale() {
    setTimeout(function () {
      deferreds.forEach(function (deferred) {
        handle(deferred)
      })
    }, 0)
  }

  asyncFn(resolve, reject)
}
module.exports = {
  stamp: function () {
    var date = new Date()

    var stampfn = ["getHours", "getMinutes", "getSeconds", "getMilliseconds"]
    var timestamp = []

    stampfn.forEach(function (value) {
      timestamp.push(date[value]())
    })

    return timestamp.join(":")
  }
}
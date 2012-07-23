var es = require('event-stream')

module.exports = function (map) {
  var mapper = (
      'object' == typeof map
    ? function (val) {
      return map[val]
    }
    : mapper
  )
  return es.connect(
      es.split(/({{[^}]+}}+)/)
    , es.mapSync(function (data) {
      var m = /^{{([^}]+)}}/.exec(data)
      if(m) return '' + mapper(m[1]) || ''
      return data
    }))
}

var util = require('../gen')
  , it = require('it-is')
  , join = require('path').join
  , fs = require('fs')

exports.__setup = function (test){
  test.done()
}

exports['can create path & write json file'] = function (test){
  var example = {
        hello: 'asdflasdfkanviuarnicvuaenbrivaberivunr'
      , bye: 12342.23
      , whatever: [1,2,3,4] }
    , path = join(__dirname, 'fixtures','whatevs.json')

  util.writeFile(path, example, function (err){
    if(err) throw err
    fs.readFile(path, 'utf-8', function (err,data){
      it(JSON.parse(data)).deepEqual(example)
      test.done()
    })
  })

}

exports['can create path & write string file'] = function (test){
  var example = 'asdsdcnsdc  dfzksdsfkj slkdj ld lsdk jsfkj'
    , path = join(__dirname, 'fixtures','whatevs.txt')

  util.writeFile(path, example, function (err){
    if(err) throw err
    fs.readFile(path, 'utf-8', function (err,data){
      it(data).deepEqual(example)
      test.done()
    })
  })

}
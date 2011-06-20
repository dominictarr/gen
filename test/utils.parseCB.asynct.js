
var gen = require('../gen')
  , it = require('it-is')

exports ['parseCB strict'] = function (test){
  var valid = {"valid":true}
  gen.parseCB(JSON.stringify(valid), true, function (err,obj){
    if(err) throw err
    it(obj).deepEqual(valid)
    test.done()
  })
}
exports ['parseCB strict invalid'] = function (test){
  gen.parseCB("{'valid':false}", true, function (err,obj){
    it(err).property('name','SyntaxError' )
    test.done()
  })
}

exports ['parseCB slack'] = function (test){
  var valid = {"valid":true}
  gen.parseCB('{valid:true}',  function (err,obj){
    if(err) throw err
    it(obj).deepEqual(valid)
    test.done()
  })
}
exports ['parseCB slack invalid'] = function (test){
  gen.parseCB("{'valid':}",  function (err,obj){
    it(err).property('name','SyntaxError' )
    test.done()
  })
}
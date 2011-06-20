var gen = require('../gen')
  , fs = require('fs')
  , it = require('it-is')
  , exec = require('child_process').exec
  , nodemock = require('nodemock')

exports.__setup = function (test){
  exec('rm -rf '+ __dirname + '/fixtures', function (err){
    if(err) throw err
    test.done()
  })
}

exports['make files'] = function (test){
  var dir = __dirname + '/fixtures' 
  gen.init(dir
    , 'proj'
    , 'Test Project for GEN'
    , gen.defaults
    ,
    function (err){
      it(fs.statSync(dir + '/proj').isDirectory()).ok(dir + '/proj' + ' should be directory')
      it(fs.statSync(dir + '/proj/test').isDirectory()).ok(dir + '/proj/test' + ' should be directory')
      it(JSON.parse(fs.readFileSync(dir + '/proj/package.json','utf-8')))
        .has(gen.defaults.files['package.json'])
      if(err) throw err
      test.done()
    })
}

exports['make config'] = function (test){
  var dir = __dirname + '/fixtures' 
    , config = gen.config(dir)

  it(JSON.parse(fs.readFileSync(dir + '/.genrc','utf-8')))
    .deepEqual(config)
  test.done()
  
  it(gen.config(dir)).deepEqual(config)
}

exports ['request to github'] = function (test){

  var name = 'user'
    , desc = 'example test'
    , body = {}
    , auth = {username: 'user', password: 'password'}

  var mock = 
    nodemock.mock('request')
    .takes({
      uri: "http://github.com/api/v2/json/repos/create?name=user&description=example%20test"
      , headers: {Authorization:"Basic dXNlcjpwYXNzd29yZA==" }
      }
      , function (){})
    .calls(1,[null,{statusCode: 200}, JSON.stringify(body)])

  var request = function (){mock.request.apply(mock,[].slice.call(arguments))}

  gen.gen(auth, name, desc, request, function (err,obj){
    if(err) throw err
    test.done()
  })

}

exports ['with err'] = function (test){

  var name = 'user'
    , desc = 'example test'
    , body = {}
    , auth = {username: 'user', password: 'password'}

  var mock = 
    nodemock.mock('request')
    .takes({
      uri: "http://github.com/api/v2/json/repos/create?name=user&description=example%20test"
      , headers: {Authorization:"Basic dXNlcjpwYXNzd29yZA==" }
      }
      , function (){})
    .calls(1,[null,{statusCode: 500}, JSON.stringify(body)])

  var request = function (){mock.request.apply(mock,[].slice.call(arguments))}

  gen.gen(auth, name, desc, request, function (err,obj){
    it(err).has({code: 500, type: 'GitHubApiError'})
    test.done()
  })

}

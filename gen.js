#!/usr/bin/env node

var query = require('querystring')
  , request = require('request')
  , create = 'http://github.com/api/v2/json/repos/create'
  , fs = require('fs')
  , path = require('path')
  , mkdirP = require('mkdirp').mkdirP
  , render = require('render')
  , style = require('style')
  , exec = require('child_process').exec

var defaults = {
  files: {
    'package.json': {
        dependencies: {}
      , devDependencies: {}
      , author: 'name <email> (website)'
    , }
    , 'readme.markdown': ''
    , '.gitignore': 'node_modules\nnode_modules/*\nnpm_debug.log\n'
    , 'test': true
    },
  auth: {username: 'user', password: 'password'}
  }

module.exports = {
  parseCB:parseCB
, error: error
, writeFile: writeFile
, init : init
, defaults: defaults
, config: config
, gen: gen
}

function config (dir){
  var file = path.join(dir,'.genrc')
  try {
    return eval('(' + fs.readFileSync(file) + ')')
  } catch (err){
    fs.writeFileSync(file, render.json.cf(defaults))
    console.log(style.bold('writing config file to:'), style.green(file))
    return defaults
  }
}

//move this into a misc project.
function parseCB (json,strict, cb) {
  var args = [].slice.call(arguments)
    , json = args.shift()
    , cb = args.pop()
    , strict = args.pop()
    , obj

  try {
    if(strict === true)
      obj = JSON.parse(json)
    else
      obj = eval('(' + json + ')')
      
  } catch (synErr) {
    return cb(synErr)
  }
  cb(null,obj)
}

function error (err,merge) {
  err = err || new Error()
  for(var i in merge){
    err[i] = merge[i]
  }
  return err
}

function merge (a,b) {
  for(var i in b){
    a[i] = b[i]
  }
  return a
}

function gen (auth, name, description, request, cb){

  if(!cb) cb = request, request = null
  if(!request) request = require('request')

  var opts = {name: name, description: description}

  var url = create + '?' + query.stringify(opts)
    , req = {
        uri:url, 
        headers : {Authorization: 'Basic ' + new Buffer(auth.username + ':' + auth.password).toString('base64')}
      }

  request(req,
    function (err,res,body){
      if(res.statusCode != 200){
        return cb(
                error(null,{
                    type:'GitHubApiError'
                  , message: 'github error'+res.statusCode + '\n' + body
                  , code: res.statusCode
                }))
      } else if (err)
        return cb(err)

      parseCB(body,cb)
    })
}

//pull this out and put it in misc project
function writeFile(p,content,cb){

  var dir = path.dirname(p)
    
  content = ('string' == typeof content ? content : render.json.cf(content))

  mkdirP(dir,0755, function (err){
    if(err) return cb(err)
    fs.writeFile(
        p
      , '' + content
      , 'utf-8'
      , cb  )
  })
}
function indent (str){
  return str.split('\n').map(function (e){
    return '  ' + e
  }).join('\n')
}
function init(p,name,description,config,cb){

  var files = Object.keys(config.files)
  function next(err){
    var file = files.shift()
      , obj = config.files[file]
      , _path = path.join(p,name,file)

    if(err) return cb (err)
    if(!file) return cb(null)
    if(file == 'package.json') obj = merge({
      name:name 
      , version: '0.0.0'
      , description:description
      , homepage: ['http://github.com',config.auth.username,name].join('/')
      , repository: {
        type: 'git'
        , url: ['https://github.com',config.auth.username,name + '.git'].join('/')
        }
      }, obj)

    if('boolean' === typeof config.files[file]) {
      console.log(style.bold('mkdir:'), style.green(_path.replace(process.cwd(),'')))
      mkdirP(_path,0755,next)
    } else {
      writeFile(_path,obj,next)
      console.log(style.bold(_path.replace(process.cwd(),'')),':')
      console.log(indent(style.green(render.json.cf(obj))))
    }
  }

  next()

}

/*
  create project directory
  create proj/package.json
  create proj/.gitignore
  create proj/readme.markdown
  git init
  create github project
  git add remote
*/

if(!module.parent) {
  console.log(style.bold(style.green('gen')), new Date)

  opts = config(process.env.HOME)
  if(opts.auth.username == 'user'){
    console.log(style.bold('default ' + style.green('~/.genrc') + ' was found.'))
    console.log()
    console.log(style.red('please edit'), style.green('~/.genrc'), 'see', style.green('http://github.com/dominictarr/gen'),'for instructions')
    process.exit(1)
  }
  var argv = process.argv.slice(2)

  if(!argv.length){
    console.log('usuage: gen [name] [description]')
    process.exit(1)
  }

  var name = argv.shift()
    , description = argv.join(' ')

  console.log("generating:" + style.green(style.bold(name)) + '\n' +  style.bold(description))

  init(process.cwd(),name,description,opts, function (err){
    exec('git init && git remote add origin ' 
        + 'git@github.com:' + opts.auth.username + '/' + name + '.git'
      ,{cwd: path.join(process.cwd(),name)}
      , 
      function (err){
        console.log(style.bold('intiailize git repo'))
        gen(opts.auth,name,description,function (err){
          if(err) {
            console.log(style.red(err))        
            console.log()
            console.log('~ pull requests accepted ~')
          }
          else
            console.log('created', style.bold(['http://github.com',opts.auth.username,name].join('/')))
        })
      })
  })
}

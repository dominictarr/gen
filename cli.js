#! /usr/bin/env node

var replace = require('./replace')
var opts = require('rc')('gen', {
  year: new Date().getFullYear()
})

if(!opts.name)
  new Error("nameless module does not compute")

process.stdin.resume()
process.stdin
  .pipe(replace(opts))
  .pipe(process.stdout)

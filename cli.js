#! /usr/bin/env node

var replace = require('./replace')
var opts = require('optimist').argv
process.stdin.resume()
process.stdin
  .pipe(replace(opts))
  .pipe(process.stdout)

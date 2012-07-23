#! /usr/bin/env bash

. ~/.gen/config

name=$2
arg=$3
if [ "$name" = -f ]; then
  name=''
fi
if [ "x$name" = x ]; then
  dir=`readlink . -e`
  name=`basename $dir`
  arg=$2
fi

__filename=$BASH_SOURCE
echo `dirname $__filename`
replace=`dirname $__filename`/cli.js
echo $replace

create () {
  curl -X POST -u "$username:$auth" "https://api.github.com/user/repos" -d "{\"name\":\"$name\"}"
}

list () {
  curl -u "$username:$auth" "https://api.github.com/user/repos"
}

delete () {
  if [ "$arg" != "-f" ]; then
    echo WARNING YOU ABOUT TO DELETE $username/$name A YOUR SURE: Y/n?
    read rusure
    case $rusure in 
      Y) echo OKAY, $rusure DELETING: $username/$name ;;
      *) exit 1 ;;
    esac 
  fi
  #gh DELETE "/repos/$username/$name" 
  curl -X DELETE -u "$username:$auth" "https://api.github.com/repos/$username/$name"
}

add () {
  if [ "$arg" = -f ]; then
    git remote rm origin >&2 
  fi
  git remote add origin "git@github.com:$username/$name.git" >&2
}

init () {
  echo init
  for file in `ls ~/.gen/default/* -1`; do
    copyTo=`basename $file`
    test -f "$copyTo" ||
      node $replace --name "$name" --year "`date +%Y`" < $file > $copyTo
  done

}
"$@"


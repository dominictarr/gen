#! /usr/bin/env bash

. ~/.gen/config

name=$2
arg=$3

dir=`readlink . -e`
dirname=`basename $dir`

if [ "$name" = -f ]; then
  name=''
fi

if [ "x$name" = x ]; then
  name=$dirname
  arg=$2
fi

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

#gen add USER
#adds 
add () {
  remote=origin

  if [ "$dirname" != "$name" ]; then
    [ "$arg" = -f ] && git remote rm $name >&2 
    git remote add "$name" "git://github.com/$name/$dirname.git" >&2
  else
    [ "$arg" = -f ] && git remote rm origin >&2 
    git remote add origin "git@github.com:$username/$name.git" >&2
  fi
}

init () {
  type="$1"
  [ "x$type" = x ] && type=default
  for file in `ls ~/.gen/$type/ -1A`; do
    copyTo=`basename $file`

    test -d  ~/.gen/$type/$file && mkdir $copyTo 2> /dev/null
    test -e "$copyTo" || {
      gen-template --name "$name" < ~/.gen/$type/$file > "$copyTo"
    }
  done
}

clone () {
  repo="$1"
  git clone "git@github.com:$username/$repo.git"
}

"$@"


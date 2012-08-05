#gen - Generate github page

```
gen create PROJECT #create page for PROJECT
gen delete PROJECT #delete page for PROJECT
gen ls             #list projects
```

## Setup

```
cp ./template.gen ~/.gen -R
```
edit `~/.gen/config`,

substitute CAPITALS.


## Templates

edit `~/.gen/default/*'  

`{{KEY}}` will be replaced with KEY from the config file


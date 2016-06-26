#gen - Generate project

initializes a github page and initial files for a new module.

The project with have the same name as the current directory.
```
gen create #create github project
gen delete #delete github project
gen init   #initialize files in this project using templates
gen ls             #list projects
```


## Setup

you need a config with your github username and password.

```
cp ./template.gen ~/.gen -R
```
edit `~/.gen/config`,

substitute CAPITALS.


## Templates

generate files with you name, and project name in appropiate places.

edit `~/.gen/default/*'  

`{{KEY}}` will be replaced with KEY from the config file



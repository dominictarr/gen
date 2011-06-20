#gen - Generate Empty Node project#

create a folder, package.json, test directory init git, create github project, add remote origin...

all in one easy command.

    gen project_name then a description of the project...

## install

    npm install gen -g

## setup

`gen` will create a `.genrc` file in your home directory. 
you will need to enter credentials into this so that gen can create github projects for you.
also, you can configure what files you want to create and how you want them created.

currently, `gen` uses basic authentication to connect to github. probably it would be better to use
and API token. pull requests accepted.

the default `.genrc` file will look like this:

    { "files": 
      { "package.json": 
        { "dependencies": {}
        , "devDependencies": {}
        , "author": "name <email> (website)" }
      , "readme.markdown": ""
      , ".gitignore": "node_modules\nnode_modules/*\nnpm_debug.log\n"
      , "test": true }
    , "auth": 
      { "username": "user"
      , "password": "password" } }
 
anything under .files will be created in the new project directory.
strings become file contents, objects will be stringified, and booleans become directories.

also it will run `git init` and `git remote add origin ...`

you will need to enter your github credentials into auth: {} so that gen can connect to github.

# PronghornJS #

This should be a little helper/structure for those, who want to use a simple MVC pattern in their webapps. This is still work in progress. Based on an idea to build an CMS on NodeJS.


### Features ###

* MVC Pattern
* Autoloader
* ObjectRegistry with psr4 like class loading
* easy to extend
* [nunjucks](https://github.com/mozilla/nunjucks) templating engine
* multilanguage support



### Installation ###

* Download source
* change to src-folder
* copy `core/config/System.dist.js` to `user/config/System.js` (without ".dist")
* run `npm install`
* open webbrowser, navigate to `http://localhost:3000` (See config for port-settings). You should see `Hello from Frontendcontroller` and a message from Socket.io.  



#### Things to do ####

* refactor hole structure for use as a npm-package
* passport-integration for user-auth and socket-auth
* more intelligent router for better isolation between environments (frontend, backend)
* adding mirgration- and seed-support 





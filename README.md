# Thiq ![](https://travis-ci.org/Thiq/Thiq.svg?branch=master)
> A complete JavaScript loader and framework for the Spigot Server API.  

[![forthebadge](http://forthebadge.com/images/badges/fuck-it-ship-it.svg)](http://forthebadge.com)

![](thiq.png)

## Installation

- Place Thiq.jar in the plugins folder
- Create a folder named `Thiq`

## Development setup

Once your plugin is installed and running, you can test code by using `/js [codeSnippet]`. Documentation on each repository will be hosted on the main website. You can hot reload the script by using `/reloadjs` or by installing the `file-watcher` module. To install more modules for your code to use, simply use `/tpm install [module-name]`

## Release History
<<<<<<< HEAD

* 3.0.0
    * Use NodeJS style bootstrapping for internal files
    * Begin work on package management
    * Use `package.json` as config rather than `plugin.yml`
    * Essentially a complete rework of how the Thiq environment runs

* 2.0.
    * Internalize some files
    * Add CommonJS style modules
    * Cleanup global pollution

=======
* 2.0.
   * Fully recode Thiq within Java 8 using Nashorn
   * Allow for modules and module loading (using CommonJS style `require`)
   * Allow for additional language compilers (i.e. CoffeeScript, TypeScript, etc)
   * Update and patch bugs
>>>>>>> d231abb476177fb4b571130e681ed34ab42b8dca
* 1.0.
   * Initial Release
  
## Planned Released
* 2.1.
   * Allow for headless testing of scripts without clients and full server loading
   * ES6 (hopefully)
   * Package management and `tpm` (Thiq Package Manager)
   * HTTP/S libraries for requests
   * Consider a new async/await system (ES5.1 doesn't really allow for it, but we have Promises)
   
## Meta

Justin Cox – [mailto:hello@thiq.org](hello@thiq.org)

[https://github.com/Conji](https://github.com/Conji/)

## Contributing

1. Fork it (<https://github.com/Thiq/Thiq/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

<!-- Markdown link & img dfn's -->
[npm-image]: https://img.shields.io/npm/v/datadog-metrics.svg?style=flat-square
[npm-url]: https://npmjs.org/package/datadog-metrics
[npm-downloads]: https://img.shields.io/npm/dm/datadog-metrics.svg?style=flat-square
[travis-image]: https://img.shields.io/travis/dbader/node-datadog-metrics/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/dbader/node-datadog-metrics
[wiki]: https://github.com/Thiq/Thiq/wiki


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FThiq%2FThiq.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FThiq%2FThiq?ref=badge_large)

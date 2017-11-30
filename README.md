# Thiq
> A complete JavaScript loader and framework for the Spigot Server API.


![](thiq.png)

## Installation

- Place Thiq.jar in the plugins folder
- Create a folder named `Thiq`
- Clone [the startup files repo](https://github.com/Thiq/thiq-scripts)
- Clone [the core repo](https://github.com/Thiq/core] into the `core` folder**
- Clone [the modules repo](https://github.com/Thiq/modules] into the `modules` folder**
- Clone [the libs repo](https://github.com/Thiq/libs] into the `libs` folder**

** _These steps will soon be automated_

## Usage example

To create a new script that runs when a player joins the game:
*Thiq/libs/myPlayerJoin.js*
```
registerEvent(player, 'join', function(event) {
  player.sendMessage('Hello! Welcome to my server!');
}
```
*Thiq/thiq.json*
```
{
  "libraries": [
    "myPlayerJoin.js"
  ]
}
```

## Development setup

Once your plugin is installed and running, you can test code by using `/js [codeSnippet]`. Documentation on each repository will be hosted on the main website. You can hot reload the script by using `/reloadjs` or by installing the `file-watcher` module. To install more modules for your code to use, simply use `/tpm install [module-name]`

## Release History

* 1.0.
    * Initial Release

## Meta

Justin Cox – hello@thiq.org

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

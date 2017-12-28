// All script initialization begins here. All globals are set in here.
global = this;

loader.load('./plugins/Thiq/core/logger.js');

function loadCore(name) {
    try {

        log('Loading core library file ' + name, 'd');
        loader.load('./plugins/Thiq/core/' + name + '.js');
    } catch (ex) {

    }
}

loadCore('types');
loadCore('loader');
loadCore('require');
loadCore('lang');
loadCore('safety');
loadCore('promise');
loadCore('config');
loadCore('events');
loadCore('commands');
loadCore('permissions');
loadCore('process');
loadCore('tts');
loadCore('thiq');
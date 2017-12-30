// All script initialization begins here. All globals are set in here.
global = this;

loader.loadCoreFile('logger');

function loadCore(name) {
    log('Loading core library file ' + name, 'd');
    loader.loadCoreFile(name);
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
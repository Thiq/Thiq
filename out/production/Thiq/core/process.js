
global.process = {
  env: {
    serverType: ServerType.unknown,
    jvmVersion: false,
    is64bit: false
  },
  nextTick: function(fn) {
    return setTimeout(fn, 50); // it's set to 50 because that's exactly 1 tick
  }
}

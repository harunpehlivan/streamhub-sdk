    // Almond does not proxy the mapConfig from the require.js.conf
    // It expects it to be specified in this file.
    // https://github.com/jrburke/almond/issues/83
    // Removing this will throw an error because our dep on 'auth'
    // requires 'debug' and not 'streamhub-sdk/debug'
    require.config({
      map: {
        '*': {
          'debug': 'streamhub-sdk/debug'
        }
      }
    });
    
    //The modules for your project will be inlined above
    //this snippet. Ask almond to synchronously require the
    //module value for 'main' here and return it as the
    //value to use for the public API for the built file.
    return require('streamhub-sdk');
}));

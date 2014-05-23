var inherits = require('inherits');
var ContentView = require('streamhub-sdk/content/views/content-view');

var CardContentView = function (opts) {
    opts.themeClass = 'content-default';
    ContentView.call(this, opts);
};
inherits(CardContentView, ContentView);

module.exports = CardContentView;

var $ = require('streamhub-sdk/jquery');
var debug = require('streamhub-sdk/debug');

var log = debug('streamhub-sdk/views/list-view');

var sharer = module.exports = function () {
    if ( ! this._delegate) {
        log('there is no share delegate');
        return;
    }
    this._delegate = function () {
        //TODO(ryanc): Need a default delegate
    };
};

// Ensure one event bound
$('body').on('contentShare.hub', sharer );

sharer.delegate = function (delegate) {
    this._delegate = delegate;
};

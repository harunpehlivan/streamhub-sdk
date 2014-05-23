'use strict';

/**
 * A mixin that decorates an instance of ContentView 
 * to have a bounded visible set
 */
function asInstagramContentView(contentView) {
    contentView.elClass += ' content-instagram ';

    contentView.events = contentView.events.extended({
        'imageError.hub': function (e, oembed) {
            this.remove();
        }
    });
};

module.exports = asInstagramContentView;

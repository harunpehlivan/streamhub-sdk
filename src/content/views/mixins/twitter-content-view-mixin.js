'use strict';

/**
 * A mixin that decorates an instance of ContentView 
 * to have a bounded visible set
 */
function asTwitterContentView(contentView) {
    contentView.elClass += ' content-tweet ';
};

module.exports = asTwitterContentView;

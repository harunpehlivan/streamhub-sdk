'use strict';

/**
 * A mixin that decorates an instance of ContentView 
 * to have a bounded visible set
 */
function asFacebookContentView(contentView) {
    contentView.elClass += ' content-facebook ';
};

module.exports = asFacebookContentView;

'use strict';

var $ = require('streamhub-sdk/jquery');
var inherits = require('inherits');
var View = require('streamhub-sdk/view');
var template = require('hgn!streamhub-sdk/content/templates/content-body');

var ContentBodyView = function (opts) {
    opts = opts || {};
    View.call(this, opts);

    this._content = opts.content;
};
inherits(ContentBodyView, View);

ContentBodyView.prototype.template = template;
ContentBodyView.prototype.elTag = 'section';
ContentBodyView.prototype.elClass = 'content-body';

ContentBodyView.prototype.getTemplateContext = function () {
    var context = $.extend({}, this._content);
    // Ensure that content.body has a p tag
    var isHtml = /^\s*<(p|div)/;
    if ( ! isHtml.test(context.body)) {
        context.body = '<p>'+context.body+'</p>';
    }
    return context;
};

module.exports = ContentBodyView;

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

ContentBodyView.prototype.getTemplateContext = function () {
    return $.extend({}, this._content);
};

module.exports = ContentBodyView;

'use strict';

var $ = require('streamhub-sdk/jquery');
var inherits = require('inherits');
var View = require('streamhub-sdk/view');
var template = require('hgn!streamhub-sdk/content/templates/content-footer');

var ContentFooterView = function (opts) {
    opts = opts || {};
    View.call(this, opts);

    this._content = opts.content;
    this._controls = {
        'left': [],
        'right': []
    };
};
inherits(ContentFooterView, View);

ContentFooterView.prototype.template = template;

ContentFooterView.prototype.footerLeftSelector = '.content-footer-left > .content-control-list';

ContentFooterView.prototype.addButton = function (button) {
    this._controls.left.push(button);

    var footerLeft = this.$el.find(this.footerLeftSelector);
    var buttonContainerEl = $('<div></div>');
    footerLeft.append(buttonContainerEl);

    button.setElement(buttonContainerEl);
    button.render();
};

ContentFooterView.prototype.removeButton = function (button) {
    button.destroy();
    this._controls.left.splice(this._controls.indexOf(button), 1);
};

ContentFooterView.prototype.getTemplateContext = function () {
    return $.extend({}, this._content);
};

module.exports = ContentFooterView;

'use strict';

var $ = require('streamhub-sdk/jquery');
var inherits = require('inherits');
var View = require('streamhub-sdk/view');
var template = require('hgn!streamhub-sdk/content/templates/content-footer');
var util = require('streamhub-sdk/util');

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
ContentFooterView.prototype.elTag = 'section';
ContentFooterView.prototype.elClass = 'content-footer';

ContentFooterView.prototype.formatDate = util.formatDate;

ContentFooterView.prototype.footerLeftSelector = '.content-footer-left > .content-control-list';
ContentFooterView.prototype.footerRightSelector = '.content-footer-right > .content-control-list';

ContentFooterView.prototype.render = function () {
    View.prototype.render.call(this);
    this._renderButtons();
};

/**
 * Clear out the current control list,
 * and render all the buttons that have been added
 */
ContentFooterView.prototype._renderButtons = function () {
    var $leftControls = this.$el.find(this.footerLeftSelector);
    var $rightControls = this.$el.find(this.footerRightSelector);

    $leftControls.innerHTML = '';
    this._controls.left.forEach(function (button) {
        // In case event handler is unbound by jQuery's html() method: http://stackoverflow.com/a/9227033
        // call setElement to ensure event handlers are bound
        button.setElement(button.el);
        $leftControls.append(button.$el);
    });

    $rightControls.innerHTML = '';
    this._controls.right.forEach(function (button) {
        // In case event handler is unbound by jQuery's html() method: http://stackoverflow.com/a/9227033
        // call setElement to ensure event handlers are bound
        button.setElement(button.el);
        $rightControls.append(button.$el);
    });
};

/**
 * Add a button to this ContentView.
 * This will re-render the buttons
 * @param button {Button} Button to add
 * @param [opts] {object}
 * @param [opts.side='left'] {'right'|'left'} Which side of the footer to add
 *     the button to
 */
ContentFooterView.prototype.addButton = function (button, opts) {
    opts = opts || {};
    var footerControls;
    var footerSide;
    if (opts.side === 'right') {
        footerControls = this._controls.right;
        footerSide = this.$el.find(this.footerRightSelector);
    } else {
        footerControls = this._controls.left;
        footerSide = this.$el.find(this.footerLeftSelector);
    }

    // Don't add the same button twice
    if (footerControls.indexOf(button) !== -1) {
        return;
    }

    footerControls.push(button);
    var buttonContainerEl = $('<div></div>');
    button.setElement(buttonContainerEl);
    button.render();

    // If the footer is rendered, then re-render all buttons.
    // If buttons are added before the ContentView is, then we shouldn't
    // render buttons
    if (footerSide.length) {
        this._renderButtons();
    }
};


/**
 * Remove a Button from the ContentView
 * @param button {Button} Button to remove
 */
ContentFooterView.prototype.removeButton = function (button) {
    this._controls.left.splice(this._controls.left.indexOf(button), 1);
    this._controls.right.splice(this._controls.right.indexOf(button), 1);

    button.destroy();
};

ContentFooterView.prototype.getTemplateContext = function () {
    var context = $.extend({}, this._content);
    if (this._content && this._content.createdAt) {
        context.formattedCreatedAt = this.formatDate(this._content.createdAt);
    }

    return context;
};

module.exports = ContentFooterView;

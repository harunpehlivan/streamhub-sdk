var $ = require('streamhub-sdk/jquery');
var inherits = require('inherits');
var debug = require('streamhub-sdk/debug');
var auth = require('auth');
var Command = require('streamhub-sdk/ui/command');
var HubButton  = require('streamhub-sdk/ui/hub-button');
var HubLikeButton = require('streamhub-sdk/ui/hub-like-button');
var LivefyreContent = require('streamhub-sdk/content/types/livefyre-content');
var CardContentView = require('streamhub-sdk/content/views/card-content-view');
var asLivefyreContentView = require('streamhub-sdk/content/views/mixins/livefyre-content-view-mixin');

'use strict';

/**
 * Defines the base class for all content-views. Handles updates to attachments
 * and loading of images.
 *
 * @param opts {Object} The set of options to configure this view with.
 * @param opts.content {Content} The content object to use when rendering. 
 * @param opts.el {?HTMLElement} The element to render this object in.
 * @param opts.shareCommand {streamhub-sdk/ui/command} Command to use
 *     for share button. If not present or cannot execute, no share button
 * @fires LivefyreContentView#removeContentView.hub
 * @exports streamhub-sdk/content/views/content-view
 * @constructor
 */
var LivefyreContentView = function (opts) {
    this.template = opts.template;

    CardContentView.apply(this, arguments);
    asLivefyreContentView(this);

    this._commands = {};
    this._setCommand({
        like: opts.likeCommand,
        share: opts.shareCommand
    });

    this._addInitialButtons();
};
inherits(LivefyreContentView, CardContentView);

LivefyreContentView.prototype._addInitialButtons = function () {
    // Like
    this._likeButton = this._createLikeButton();
    if (this._likeButton) {
        this.addButton(this._likeButton);
    }
    // Share
    this._shareButton = this._createShareButton();
    if (this._shareButton) {
        this.addButton(this._shareButton);
    }
};

/**
 * Set the a command for a buton
 * This should only be called once.
 */
LivefyreContentView.prototype._setCommand = function (cmds) {
    for (var name in cmds) {
        if (cmds.hasOwnProperty(name)) {
            if (! cmds[name]) {
                continue;
            }
            this._commands[name] = cmds[name];

            // If canExecute changes, re-render buttons because now maybe the button should appear
            cmds[name].on('change:canExecute', this._footerView._renderButtons.bind(this._footerView));
        }
    }
};

/**
 * Create a Button to be used for Liking functionality
 * @protected
 */
LivefyreContentView.prototype._createLikeButton = function () {
    // Don't render a button when no auth delegate
    if ( ! auth.hasDelegate('login')) {
        return;
    }
    // Don't render a button if this isn't actually LivefyreContent
    if ( ! (this.content instanceof LivefyreContent)) {
        return;
    }
    return new HubLikeButton(this._commands.like, {
        content: this.content
    });
};

/**
 * Create a Share Button
 * @protected
 */
LivefyreContentView.prototype._createShareButton = function () {
    var shareCommand = this._commands.share;
    if ( ! (shareCommand && shareCommand.canExecute())) {
        return;
    }
    var shareButton = new HubButton(shareCommand, {
        className: 'btn-link content-share',
        label: 'Share'
    });
    return shareButton;
};

module.exports = LivefyreContentView;

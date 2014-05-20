define([
    'streamhub-sdk/jquery',
    'auth',
    'streamhub-sdk/content/views/content-view',
    'streamhub-sdk/content/types/livefyre-content',
    'streamhub-sdk/content/types/livefyre-opine',
    'streamhub-sdk/ui/auth-required-command',
    'streamhub-sdk/ui/command',
    'streamhub-sdk/ui/hub-button',
    'streamhub-sdk/ui/hub-like-button',
    'streamhub-sdk/collection/liker',
    'hgn!streamhub-sdk/content/templates/content',
    'streamhub-sdk/util',
    'inherits',
    'streamhub-sdk/debug'
], function ($, auth, ContentView, LivefyreContent, LivefyreOpine, AuthRequiredCommand, Command, HubButton, HubLikeButton, Liker, ContentTemplate, util, inherits, debug) {
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
    var LivefyreContentView = function LivefyreContentView (opts) {
        opts = opts || {};

        ContentView.call(this, opts);

        this._commands = {};
        this._setCommand({
            like: opts.likeCommand,
            share: opts.shareCommand
        });
        this._themeClass = opts.themeClass || 'content-default';
        if (opts.template) {
            this.template = opts.template;
        }

        this._addInitialButtons();
    };
    inherits(LivefyreContentView, ContentView);


    /**
     * Set the a command for a buton
     * This should only be called once.
     * @private
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
     * Render the content inside of the LivefyreContentView's element.
     * @returns {LivefyreContentView}
     */
    LivefyreContentView.prototype.render = function () {
        ContentView.prototype.render.call(this);
        this.$el.addClass(this._themeClass);
        return this;
    };

    /**
     * Create and add any buttons that should be on all LivefyreContentViews.
     * This will be invoked on construction
     * They will be rendered by ._renderButtons later.
     */
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

    LivefyreContentView.prototype._updateLikeCount = function () {
        this._likeButton.updateLabel(this.content.getLikeCount().toString());
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

    /**
     * Add a button to this ContentView.
     * This will re-render the buttons
     * @param button {Button} Button to add
     * @param [opts] {object}
     * @param [opts.side='left'] {'right'|'left'} Which side of the footer to add
     *     the button to
     */
    LivefyreContentView.prototype.addButton = function (button, opts) {
        this._footerView.addButton(button, opts);
    };

    /**
     * Remove a Button from the ContentView
     * @param button {Button} Button to remove
     */
    LivefyreContentView.prototype.removeButton = function (button) {
        this._footerView.removeButton(button);
    };

    return LivefyreContentView;
});

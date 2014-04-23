define([
    'streamhub-sdk/jquery',
    'auth',
    'streamhub-sdk/content/views/content-view',
    'streamhub-sdk/content/types/livefyre-content',
    'streamhub-sdk/content/types/livefyre-opine',
    'streamhub-sdk/ui/auth-required-command',
    'streamhub-sdk/ui/command',
    'streamhub-sdk/ui/hub-button',
    'streamhub-sdk/collection/liker',
    'hgn!streamhub-sdk/content/templates/content',
    'streamhub-sdk/util',
    'inherits',
    'streamhub-sdk/debug'
], function ($, auth, ContentView, LivefyreContent, LivefyreOpine, AuthRequiredCommand, Command, HubButton, HubLikeButton, Liker, ContentTemplate, util, inherits, debug) {
    'use strict';

    var LIKE_REQUEST_LISTENER = false;

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

        this._rendered = false;
        this._controls = {
            'left': [],
            'right': []
        };
        this._commands = {};
        this._setCommand({
            like: opts.likeCommand,
            share: opts.shareCommand
        });

        ContentView.call(this, opts);
    };
    inherits(LivefyreContentView, ContentView);

    LivefyreContentView.prototype.footerLeftSelector = '.content-footer-left';
    LivefyreContentView.prototype.footerRightSelector = '.content-footer-right';


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
                cmds[name].on('change:canExecute', this._renderButtons.bind(this));
            }
        }
    };

    /**
     * Render the content inside of the LivefyreContentView's element.
     * @returns {LivefyreContentView}
     */
    LivefyreContentView.prototype.render = function () {
        ContentView.prototype.render.call(this);
        this._renderButtons();
        return this;
    };

            $('body').on('contentLike.hub', function (e, content) {
                var liker = new Liker();
                var userUri = Auth.getUserUri();

                if (! content.isLiked(userUri)) {
                    liker.like(content);
                } else {
                    liker.unlike(content);
                }
                self._renderButtons();
            });
            $('body').on('likeClick.hub', LivefyreContentView.handleLikeClick);
            LIKE_REQUEST_LISTENER = true;
        }

        this.$el.find(this.footerLeftSelector).empty();
        this.$el.find(this.footerRightSelector).empty();

        this._renderLikeButton();
        this._renderShareButton();
    LivefyreContentView.prototype._renderButtons = function () {
        if (! (this.content instanceof LivefyreContent)) {
            return;
        }

        this.$el.find(this.footerLeftSelector).empty();
        this.$el.find(this.footerRightSelector).empty();

        //TODO(ryanc): Wait until we have replies on SDK
        //var replyCommand = new Command(function () {
        //    self.$el.trigger('contentReply.hub');
        //});
        //var replyButton = new HubButton(replyCommand, {
        //    className: 'btn-link content-reply',
        //    label: 'Reply'
        //});
        //this.addButton(replyButton);

            //TODO(ryanc): Wait until we have likes finished first
            //var shareButton = new HubButton(this._handleShare.bind(this), {
            //    className: 'hub-btn-link hub-content-share',
            //    label: 'Share'
            //});
            //this.addButton(shareButton);
        } else {
            for (var i=0; i < this._controls['left'].length; i++) {
                this.addButton(this._controls['left'][i]);
            }
    /**
     * Render a Share Button
     * @protected
     */
    LivefyreContentView.prototype._renderShareButton = function () {
        var shareButton = this._createShareButton();
        if ( ! shareButton) {
            return;
        } else {
            for (var i=0; i < this._controls['left'].length; i++) {
                this.addButton(this._controls['left'][i]);
            }
        //TODO(ryanc): Wait until we have likes finished first
        //var shareButton = new HubButton(this._handleShare.bind(this), {
        //    className: 'hub-btn-link hub-content-share',
        //    label: 'Share'
        //});
        //this.addButton(shareButton);
    };

        this._controls['left'].push(button);
    LivefyreContentView.prototype.addButton = function (button, opts) {
        opts = opts || {};
        var footerControls;
        var footerSide;
        if (opts.side === 'right') {
            footerControls = this._controls.right;
            footerSide = this.$el.find(this.footerRightSelector);
        } else {
            footerControls = this._controls.left;
            footerSide = this.$el.find(this.footerLeftSelector);
    LivefyreContentView.prototype.addButton = function (button) {
        for (var i=0; i < this._controls['left'].length; i++) {
            if (this._controls['left'][i] != button) {
                this._controls['left'].push(button);
            }
        }

        if (footerControls.length === 0) {
            footerControls.push(button);
        }
        footerControls.push(button);
        var buttonContainerEl = $('<div></div>');
        footerSide.append(buttonContainerEl);
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
    LivefyreContentView.prototype.removeButton = function (button) {
        this._controls.left.splice(this._controls.left.indexOf(button), 1);
        this._controls.right.splice(this._controls.right.indexOf(button), 1);
        
        button.destroy();
    };
    
    return LivefyreContentView;
});

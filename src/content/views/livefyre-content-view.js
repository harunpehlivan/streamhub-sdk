define([
    'streamhub-sdk/jquery',
    'streamhub-sdk/auth',
    'streamhub-sdk/content/views/content-view',
    'streamhub-sdk/content/types/livefyre-content',
    'streamhub-sdk/ui/hub-button',
    'streamhub-sdk/ui/hub-toggle-button',
    'hgn!streamhub-sdk/content/templates/content',
    'streamhub-sdk/util',
    'inherits',
    'streamhub-sdk/debug'
], function ($, Auth, ContentView, LivefyreContent, HubButton, HubToggleButton, ContentTemplate, util, inherits, debug) {
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

        this._controls = {
            'left': [],
            'right': []
        };
        this._rendered = false;
        this._setShareCommand(opts.shareCommand);
        this._shareable = opts.shareable === undefined ? true : opts.shareable;

        ContentView.call(this, opts);
    };
    inherits(LivefyreContentView, ContentView);

    LivefyreContentView.prototype.footerLeftSelector = '.content-footer-left';

    /**
     * Render the content inside of the LivefyreContentView's element.
     * @returns {LivefyreContentView}
     */
    LivefyreContentView.prototype.render = function () {
        ContentView.prototype.render.call(this);
        this._renderButtons();
        return this;
    };

    LivefyreContentView.prototype._handleShare = function () {
        this.$el.trigger('shareContent.hub', this.content);
    };

    LivefyreContentView.prototype._renderButtons = function () {
        this.$el.find(this.footerLeftSelector).empty();
        this.$el.find(this.footerRightSelector).empty();

        //TODO(ryanc): Wait until we have auth
        // to add like button
        //var likeButton = this._createLikeButton();
        //this.addButton(likeButton);

        //TODO(ryanc): Wait until we have replies on SDK
        //var replyCommand = new Command(function () {
        //    self.$el.trigger('contentReply.hub');
        //});
        //var replyButton = new HubButton(replyCommand, {
        //    className: 'btn-link content-reply',
        //    label: 'Reply'
        //});
        //this.addButton(replyButton);

        this._renderShareButton();
    };

    /**
     * Render a Share Button
     * @protected
     */
    LivefyreContentView.prototype._renderShareButton = function () {
        var shareButton = this._createShareButton();
        if ( ! shareButton) {
            return;
        }
        this.addButton(shareButton);
    };

    /**
     * Create a Share Button
     * @protected
     */
    LivefyreContentView.prototype._createShareButton = function () {
        var shareCommand = this._shareCommand;
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
     * Set the share command
     * This should only be called once.
     * @private
     */
    LivefyreContentView.prototype._setShareCommand = function (shareCommand) {
        this._shareCommand = shareCommand;
        if ( ! shareCommand) {
            return;
        }
        // If canExecute changes, re-render buttons because now maybe the share
        // button should appear
        shareCommand.on('change:canExecute', this._renderButtons.bind(this));
    };

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
        }

        if (footerControls.length === 0) {
            footerControls.push(button);
        }
        for (var i=0; i < footerControls.length; i++) {
            if (footerControls[i] !== button) {
                footerControls.push(button);
            }
        }

        var buttonContainerEl = $('<div></div>');
        footerSide.append(buttonContainerEl);

        button.setElement(buttonContainerEl);
        button.render();
    };

    LivefyreContentView.prototype.removeButton = function (button) {
        this._controls.left.splice(this._controls.left.indexOf(button), 1);
        this._controls.right.splice(this._controls.right.indexOf(button), 1);

        button.destroy();
    };
    
    return LivefyreContentView;
});

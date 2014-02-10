define([
    'streamhub-sdk/jquery',
    'streamhub-sdk/auth',
    'streamhub-sdk/content/views/content-view',
    'streamhub-sdk/content/types/livefyre-content',
    'streamhub-sdk/ui/button/hub-button',
    'streamhub-sdk/ui/button/hub-toggle-button',
    'streamhub-sdk/collection/clients/write-client',
    'hgn!streamhub-sdk/content/templates/content',
    'streamhub-sdk/util',
    'inherits',
    'streamhub-sdk/debug'
], function ($, Auth, ContentView, LivefyreContent, HubButton, HubToggleButton, LivefyreWriteClient, ContentTemplate, util, inherits, debug) {
    'use strict';

    var log = debug('streamhub-sdk/content/views/livefyre-content-view');
    var LF_TOKEN = 'eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJkb21haW4iOiAibGFicy10NDAyLmZ5cmUuY28iLCAiZXhwaXJlcyI6IDExMzkxNzI4ODEzLjAzOTY2LCAidXNlcl9pZCI6ICJkZW1vLTAifQ.ZJLrUcRf3MbgOqJ1tLO81pZ7ANfatsKgLie6T6S_Wi4';
    var USER_ID = 'demo-0@labs-t402.fyre.co';

    /**
     * Defines the base class for all content-views. Handles updates to attachments
     * and loading of images.
     *
     * @param opts {Object} The set of options to configure this view with.
     * @param opts.content {Content} The content object to use when rendering. 
     * @param opts.el {?HTMLElement} The element to render this object in.
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
        this._likeRequestListener = false;
        this._rendered = false;

        ContentView.call(this, opts);

        this._addInitialButtons();
    };
    inherits(LivefyreContentView, ContentView);

    LivefyreContentView.prototype.footerLeftSelector = '.content-footer-left > .content-control-list';
    LivefyreContentView.prototype.footerRightSelector = '.content-footer-right > .content-control-list';

    /**
     * Render the content inside of the LivefyreContentView's element.
     * @returns {LivefyreContentView}
     */
    LivefyreContentView.prototype.render = function () {
        ContentView.prototype.render.call(this);
        this._setupButtons();

        return this;
    };

    LivefyreContentView.prototype._renderButtons = function () {
        if (! (this.content instanceof LivefyreContent)) {
            return;
        }

        this.$el.find(this.footerLeftSelector).empty();
        this.$el.find(this.footerRightSelector).empty();


        this._renderLikeButton();
        this._renderShareButton();
    };

    LivefyreContentView.prototype._handleShare = function () {
        console.log('contentShare.hub');
        this.$el.trigger('contentShare.hub', this.content);
    };

    /**
     * Create a Button to be used for Liking functionality
     * @protected
     */
    LivefyreContentView.prototype._createLikeButton = function () {
        if (! auth.hasDelegate('login')) {
            return; // Don't render a button when not logged in
            return;
        }
        return new HubLikeButton(this._commands.like, {
            content: this.content
        });
    };

    LivefyreContentView.prototype._renderLikeButton = function () {
        var likeButton = this._likeButton = this._createLikeButton();
        if ( ! likeButton) {
            return;
        }
        this.addButton(likeButton);
    };

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
        this._rendered = true;
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
        button.destroy();
    };
    
    return LivefyreContentView;
});

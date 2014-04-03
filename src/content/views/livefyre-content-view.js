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

    LivefyreContentView.prototype._renderButtons = function () {
        this.$el.find(this.footerLeftSelector).empty();
        this.$el.find(this.footerRightSelector).empty();

        if (! (this.content instanceof LivefyreContent)) {
            return;
        }

        //TODO(ryanc): Wait until we have auth
        // to add like button
        //var likeButton = this._createLikeButton();
        //this.addButton(likeButton);

        //TODO(ryanc): Wait until we have replies on SDK
        //var replyCommand = new Command(function () {
        //    self.$el.trigger('contentReply.hub');
        //});
        //var replyButton = new HubButton(replyCommand, {
        //    className: 'hub-btn-link hub-content-reply',
        //    label: 'Reply'
        //});
        //this.addButton(replyButton);

        //TODO(ryanc): Wait until we have likes finished first
        //var shareButton = new HubButton(this._handleShare.bind(this), {
        //    className: 'hub-btn-link hub-content-share',
        //    label: 'Share'
        //});
        //this.addButton(shareButton);
    };

    LivefyreContentView.prototype.addButton = function (button) {
        for (var i=0; i < this._controls.left.length; i++) {
            if (this._controls.left[i] !== button) {
                this._controls.left.push(button);
            }
        }

        var footerLeft = this.$el.find(this.footerLeftSelector);
        var buttonContainerEl = $('<div></div>');
        footerLeft.append(buttonContainerEl);

        button.setElement(buttonContainerEl);
        button.render();
    };

    LivefyreContentView.prototype.removeButton = function (button) {
        button.destroy();
    };
    
    return LivefyreContentView;
});

'use strict';

var $ = require('streamhub-sdk/jquery');
var inherits = require('inherits');
var View = require('streamhub-sdk/view');
var TiledAttachmentListView = require('streamhub-sdk/content/views/tiled-attachment-list-view');

var ContentThumbnailAttachmentsView = function (opts) {
    opts = opts || {};
    View.call(this, opts);

    this._content = opts.content;
    this._attachmentListView = opts.attachmentListView || new TiledAttachmentListView(opts);
};
inherits(ContentThumbnailAttachmentsView, View);

ContentThumbnailAttachmentsView.prototype.elClass = 'content-thumbnail-attachments';

ContentThumbnailAttachmentsView.prototype.render = function () {
    this.$el.append(this._attachmentListView.$el);
    this._attachmentListView.render();
};

module.exports = ContentThumbnailAttachmentsView;

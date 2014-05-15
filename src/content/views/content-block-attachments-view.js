'use strict';

var $ = require('streamhub-sdk/jquery');
var inherits = require('inherits');
var View = require('streamhub-sdk/view');
var AttachmentListView = require('streamhub-sdk/content/views/attachment-list-view');

var ContentBlockAttachmentsView = function (opts) {
    opts = opts || {};
    View.call(this, opts);

    this._content = opts.content;
    this._attachmentListView = opts.attachmentListView || new AttachmentListView(opts);
};
inherits(ContentBlockAttachmentsView, View);

ContentBlockAttachmentsView.prototype.elClass = 'content-block-attachments';

ContentBlockAttachmentsView.prototype.render = function () {
    this.$el.append(this._attachmentListView.$el);
    this._attachmentListView.render();
};

module.exports = ContentBlockAttachmentsView;

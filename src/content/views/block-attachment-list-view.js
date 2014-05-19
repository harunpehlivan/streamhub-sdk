'use strict';

var AttachmentListView = require('streamhub-sdk/content/views/attachment-list-view');
var inherits = require('inherits');

var BlockAttachmentListView = function (opts) {
    opts = opts || {};
    AttachmentListView.call(this, opts);
};
inherits(BlockAttachmentListView, AttachmentListView);

/**
 * Checks whether attachment is block-style. (aka link or rich)
 * @returns {boolean} Whether an attachment is block-style
 */
BlockAttachmentListView.prototype.isBlockAttachment = function (oembed) {
    if (oembed.type !== 'photo' && oembed.type !== 'video') {
        return true;
    }
    return false;
};

BlockAttachmentListView.prototype._insert = function (oembedView) {
    var stackedAttachmentsEl = this.$el.find(this.stackedAttachmentsSelector);
    if (this.isBlockAttachment(oembedView.oembed)) {
        oembedView.$el.appendTo(stackedAttachmentsEl);
    }
};

module.exports = BlockAttachmentListView;

'use strict';

var $ = require('jquery');
var jasmineJquery = require('jasmine-jquery');
var Content = require('streamhub-sdk/content');
var BlockAttachmentListView = require('streamhub-sdk/content/views/block-attachment-list-view');

describe('BlockAttachmentListView', function () {

    var oembedAttachment = {
        provider_name: "Twimg",
        provider_url: "http://pbs.twimg.com",
        type: "photo",
        url: "http://pbs.twimg.com/media/BQGNgs9CEAEhmEF.jpg"
    };
    var content = new Content({ body: 'what' });

    describe('when adding an attachment', function () {
        describe('with link attachment', function() {
            var blockAttachmentListView = new BlockAttachmentListView({ content: content });
            blockAttachmentListView.setElement($('<div></div>'));
            blockAttachmentListView.render();
            oembedAttachment.type = 'link';
            blockAttachmentListView.add(oembedAttachment);

            it('is a stacked attachment (appended to .content-attachments-stacked)', function() {
                expect(blockAttachmentListView.$el.find('.content-attachments-stacked')).toContain('.content-attachment');
            });
        });

        describe('with rich attachment', function() {
            var blockAttachmentListView = new BlockAttachmentListView({ content: content });
            blockAttachmentListView.setElement($('<div></div>'));
            blockAttachmentListView.render();
            oembedAttachment.type = 'rich';
            blockAttachmentListView.add(oembedAttachment);

            it('is a stacked attachment (appended to .content-attachments-stacked)', function() {
                expect(blockAttachmentListView.$el.find('.content-attachments-stacked')).toContain('.content-attachment');
            });
        });
    });
});

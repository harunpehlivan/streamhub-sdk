define([
	'inherits',
	'streamhub-sdk/view',
	'streamhub-sdk/content/views/gallery-attachment-list-view',
	'streamhub-sdk/content/views/attachment-list-view'
], function (inherits, View, GalleryAttachmentListView, AttachmentListView) {
    'use strict';

	/**
	 * A View that initially renders the passed view, but on focusContent.hub,
	 * shows a GalleryAttachmentListView instead
	 */
	var GalleryOnFocusView = function (initialView, opts) {
		opts = opts || {};
		this._isGallery = false;
		this._initialView = initialView;
        this._rendered = false;
        this._renderedInitialView = false;
		View.call(this, opts);
        if (opts.content) {
            this.setContent(opts.content);
        }
	};
	inherits(GalleryOnFocusView, View);

    GalleryOnFocusView.prototype.events = View.prototype.events.extended({
        'click': function () {
            debugger
        },
        'focusContent.hub': function () {
            debugger
        }
    })

	GalleryOnFocusView.prototype.setContent = function (content) {
		this._initialView.setContent(content);
	};

	GalleryOnFocusView.prototype.add = function (attachment) {
        debugger;
        AttachmentListView.prototype.add.call(this, attachment);
		if (this._focusedView) {
			this._focusedView.add(attachment);
		}
	};
    var renderCount = 0;
	GalleryOnFocusView.prototype.render = function () {
        renderCount++;
        if (this._rendered) {
            return;
        }
		View.prototype.render.call(this);
        console.log('GalleryOnFocusView render', Math.random());
        debugger;
		this._initialView.$el.appendTo(this.$el);
        if ( ! this._renderedInitialView) {
            this._initialView.render();
            this._renderedInitialView = true;
        }
        this._rendered = true;
	};

    GalleryOnFocusView.prototype.setElement = function (el) {
        var self = this;
        debugger;
        var ret = View.prototype.setElement.apply(this, arguments);
        this._rendered = false;
        return ret;
    };

	GalleryOnFocusView.prototype.focus = function (attachment) {
		if (this._isGallery || (attachment.type !== 'photo' && attachment.type !== 'video')) {
			return;
		}
		this._focusedView = this._createFocusedView({
			content: this._initialView.content,
			attachmentToFocus: attachment
		});
		this._focusedView.$el.appendTo(this.$el);
		this._focusedView.render();

		this._initialView.$el.hide();
		this._isGallery = true;
	};


	GalleryOnFocusView.prototype._createFocusedView = function (opts) {
        var view = new GalleryAttachmentListView({
            content: opts.content,
            attachmentToFocus: opts.attachmentToFocus,
            userInfo: false,
            pageCount: false,
            pageButtons: false,
            thumbnails: true,
            proportionalThumbnails: true
        });
        view.$el.addClass('content-attachments-interactive-gallery');
        return view;
	};

	return GalleryOnFocusView;
});

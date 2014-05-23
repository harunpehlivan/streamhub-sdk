var $ = require('streamhub-sdk/jquery');
var inherits = require('inherits');
var LivefyreContentView = require('streamhub-sdk/content/views/livefyre-content-view');
var asLivefyreContentView = require('streamhub-sdk/content/views/mixins/livefyre-content-view-mixin');
var asFacebookContentView = require('streamhub-sdk/content/views/mixins/facebook-content-view-mixin');

'use strict';

/**
 * A view for rendering facebook content into an element.
 * @param opts {Object} The set of options to configure this view with (See LivefyreContentView).
 * @exports streamhub-sdk/content/views/facebook-content-view
 * @constructor
 */
var FacebookContentView = function FacebookContentView (opts) {
    LivefyreContentView.apply(this, arguments);

    asLivefyreContentView(this);
    asFacebookContentView(this);
};
inherits(FacebookContentView, LivefyreContentView);

FacebookContentView.prototype.elClass += ' content-facebook ';

/**
 * Gets the template rendering context. By default, returns "this.content".
 * @return {Content} The content object this view was instantiated with.
 */
FacebookContentView.prototype.getTemplateContext = function () {
    var context = LivefyreContentView.prototype.getTemplateContext.call(this);
    if (context.attachments.length) {
        context.permalink = context.attachments[0].url;
    }
    
    context.authorUrl = context.author.profileUrl;

    context.contentSourceName = 'facebook';
    context.contentSourceTooltipUrl = context.permalink;
    context.contentSourceTooltipText = 'View on Facebook';

    context.createdAtUrl = context.permalink;

    return context;
};

module.exports = FacebookContentView;

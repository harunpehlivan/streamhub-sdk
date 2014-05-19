'use strict';

var $ = require('streamhub-sdk/jquery');
var inherits = require('inherits');
var View = require('streamhub-sdk/view');
var template = require('hgn!streamhub-sdk/content/templates/content-header');
var debug = require('debug');

var log = debug('streamhub-sdk/content/views/content-header-view');

var ContentHeaderView = function (opts) {
    opts = opts || {};
    View.call(this, opts);

    this._content = opts.content;
};
inherits(ContentHeaderView, View);

ContentHeaderView.prototype.template = template;
ContentHeaderView.prototype.elTag = 'section';
ContentHeaderView.prototype.elClass = 'content-header';

ContentHeaderView.prototype.headerElSelector = '.content-header';
ContentHeaderView.prototype.avatarSelector = '.content-author-avatar';
ContentHeaderView.prototype.tooltipElSelector = '.hub-tooltip-link';

ContentHeaderView.prototype.events = View.prototype.events.extended({}, function (events) {
    events['click ' + this.headerElSelector] = function(e) {
        if (! this.$el.hasClass(this.contentWithImageClass)) {
            // Only do this when there is an image
            return;
        }
        var headerEl = $(e.currentTarget);
        var frameEl = this.$el.find('.content-attachments-tiled ' + this.attachmentFrameElSelector);

        headerEl.hide();
        frameEl.hide();
        var targetEl = document.elementFromPoint(e.clientX, e.clientY);
        frameEl.show();
        headerEl.show();

        $(targetEl).trigger('click');
    };
    events['mouseenter ' + this.tooltipElSelector] = function (e) {
        var target = e.target;
        var title = $(target).attr('title');
        var position = $(target).position();
        var positionWidth = $(target).width();

        var $currentTooltip = $("<div class=\"hub-current-tooltip content-action-tooltip\"><div class=\"content-action-tooltip-bubble\">" + title + "</div><div class=\"content-action-tooltip-tail\"></div></div>");
        $(target).parent().append($currentTooltip);

        var tooltipWidth = $currentTooltip.outerWidth();
        var tooltipHeight = $currentTooltip.outerHeight();

        $currentTooltip.css({
            "left": position.left + (positionWidth / 2) - (tooltipWidth / 2),
            "top":  position.top - tooltipHeight - 2
        });

        if ($(target).hasClass(this.tooltipElSelector)){
            var currentLeft = parseInt($currentTooltip.css('left'), 10);
            $currentTooltip.css('left', currentLeft + 7);
        }

        $currentTooltip.fadeIn();
    };
    events['mouseleave ' + this.tooltipElSelector] = function (e) {
        var $current = this.$el.find('.hub-current-tooltip');
        $current.removeClass('hub-current-tooltip').fadeOut(200, function(){
            $current.remove();
        });
    };
});

ContentHeaderView.prototype.render = function () {
    View.prototype.render.call(this);

    // If avatar fails to load, hide it
    // Error events don't bubble, so we have to bind here
    // http://bit.ly/JWp86R
    this.$(this.avatarSelector+' img')
        .on('error', $.proxy(this._handleAvatarError, this));
};

/**
 * Handle an error loading the avatar by removing the avatar element
 * @private
 */
ContentHeaderView.prototype._handleAvatarError = function (e) {
    log('avatar error, hiding it', e);
    this.$(this.avatarSelector).remove();
};

ContentHeaderView.prototype.getTemplateContext = function () {
    return $.extend({}, this._content);
};

module.exports = ContentHeaderView;

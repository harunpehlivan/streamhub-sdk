'use strict';

/**
 * A mixin that decorates an instance of ContentView 
 * to be a LivefyreContentView
 */
function asLivefyreContentView(contentView) {
    /**
     * Render the content inside of the LivefyreContentView's element.
     * @returns {LivefyreContentView}
     */
    var oldRender = contentView.render;
    contentView.render = function () {
        oldRender.apply(contentView, arguments);
        contentView.$el.addClass(contentView._themeClass);
    };

    contentView._updateLikeCount = function () {
        contentView._likeButton.updateLabel(contentView.content.getLikeCount().toString());
    };

    /**
     * Add a button to this ContentView.
     * This will re-render the buttons
     * @param button {Button} Button to add
     * @param [opts] {object}
     * @param [opts.side='left'] {'right'|'left'} Which side of the footer to add
     *     the button to
     */
    contentView.addButton = function (button, opts) {
        contentView._footerView.addButton(button, opts);
    };

    /**
     * Remove a Button from the ContentView
     * @param button {Button} Button to remove
     */
    contentView.removeButton = function (button) {
        contentView._footerView.removeButton(button);
    };
};

module.exports = asLivefyreContentView;

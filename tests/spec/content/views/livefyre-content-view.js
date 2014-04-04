define([
    'streamhub-sdk/content/views/livefyre-content-view',
    'streamhub-sdk/content',
    'streamhub-sdk/ui/button'
], function (LivefyreContentView, Content, Button) {
    'use strict';

    describe('LivefyreContentView', function () {

        describe('Buttons (footer)', function () {
            var contentView;

            beforeEach(function () {
                contentView = new LivefyreContentView({
                    content: new Content('blah')
                });

            });

            it('can add a button', function () {
                var button = new Button();
                contentView.addButton(button);
                expect(contentView._controls.left.length).toBe(1);
                expect(contentView._controls.left[0]).toBe(button);
            });

            it('can remove a button', function () {
                var button = new Button();
                contentView.addButton(button);
                expect(contentView._controls.left.length).toBe(1);
                expect(contentView._controls.left[0]).toBe(button);
               
                contentView.removeButton(button);
                expect(contentView._controls.left.length).toBe(0);
            });
        });

    });

});

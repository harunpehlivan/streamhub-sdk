define([
    'streamhub-sdk/ui/hub-button',
    'guid'],
function (HubButton, GUID) {
    'use strict';

    describe('HubButton', function () {
        /**
         * The HubButton module will take care of inserting the
         * CSS it requires.
         * It will prefix all the selectors with a GUID class
         * and each instance with have that class on its el
         */
        describe('guid-prefixed css', function () {
            it('HubButton.guid is a guid', function () {
                expect(typeof HubButton.guid).toBe('string');
                expect(HubButton.guid.split('-').length).toBe(5);
            });
            it('inserts a style el with the GUID.htmlAttr(guid)', function () {
                var guid = HubButton.guid;
                var styleEl = document.getElementById(GUID.htmlAttr(guid));
                expect(styleEl).toBeTruthy();
            });
            it('puts the GUID class on the .el', function () {
                var guid = HubButton.guid;
                var guidClass = GUID.htmlAttr(guid);
                var hubButton = new HubButton();
                var first$el = hubButton.$el;
                expect(hubButton.$el.hasClass(guidClass)).toBe(true);
                var second$el = $('<div />');
                hubButton.setElement(second$el);
                expect(first$el.hasClass(guidClass)).toBe(false);
                expect(second$el.hasClass(guidClass)).toBe(true);
            });
            it('does not put the GUID class on the .el if opts.guidClass=false', function () {
                var guid = HubButton.guid;
                var guidClass = GUID.htmlAttr(guid);
                var hubButton = new HubButton(undefined, {
                    guidClass: false
                });
                var first$el = hubButton.$el;
                expect(hubButton.$el.hasClass(guidClass)).toBe(false);
                var second$el = $('<div />');
                hubButton.setElement(second$el);
                expect(first$el.hasClass(guidClass)).toBe(false);
                expect(second$el.hasClass(guidClass)).toBe(false);
            });
        });
    });
});

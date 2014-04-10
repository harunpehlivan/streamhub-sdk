define([
    'jquery',
    'auth',
    'auth-livefyre',
    'auth-livefyre/livefyre-auth-delegate',
    'auth-livefyre-tests/mocks/mock-user-factory',
    'json!auth-livefyre-tests/mocks/auth-response.json',
    'streamhub-sdk/util',
    'streamhub-sdk/content',
    'streamhub-sdk/content/types/livefyre-content',
    'streamhub-sdk/content/types/livefyre-twitter-content',
    'streamhub-sdk/content/types/livefyre-opine',
    'streamhub-sdk/content/views/livefyre-content-view',
    'streamhub-sdk/content/content-view-factory',
    'streamhub-sdk/ui/button',
    'streamhub-sdk/ui/command'],
function (
    $,
    auth,
    authLivefyre,
    livefyreAuthDelegate,
    MockUserFactory,
    mockAuthResponse,
    util,
    Content,
    LivefyreContent,
    LivefyreTwitterContent,
    LivefyreOpine,
    LivefyreContentView,
    ContentViewFactory,
    Button,
    Command) {
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

        describe('Like button', function () {

            var mockUserFactory,
                user;

            beforeEach(function () {
                // Auth mock user
                mockUserFactory = new MockUserFactory();
                user = mockUserFactory.createUser();
                auth.login({ livefyre: user});
            });

            afterEach(function () {
                auth.logout();
            });

            it("only renders for non-Twitter content items", function () {
                var contentViewFactory = new ContentViewFactory();

                var twitterContent = new LivefyreTwitterContent({
                    id: 'tweet-1234@twitter.com',
                    body: 'tweet i am',
                    author: {
                        id: 'jimmy@twitter.com'
                    }
                });
                var twitterContentView = contentViewFactory.createContentView(twitterContent);
                twitterContentView.render();

                expect(twitterContentView.$el.find('.hub-content-like')).toHaveLength(0);

                var lfContent = new LivefyreContent({ body: 'lf content' });
                var lfContentView = contentViewFactory.createContentView(lfContent);
                lfContentView.render();

                expect(lfContentView.$el.find('.hub-content-like')).toHaveLength(1);
            });

            it("is in the toggle off state when not liked by authenticated user", function () {
                var contentViewFactory = new ContentViewFactory();
                var lfContent = new LivefyreContent({ body: 'lf content' });
                var lfContentView = contentViewFactory.createContentView(lfContent);
                lfContentView.render();

                expect(lfContentView.$el.find('.hub-btn-toggle-off')).toHaveLength(1);
            });

            it("is in the toggle on state when liked by authenticated user", function () {
                var contentViewFactory = new ContentViewFactory();
                var lfContent = new LivefyreContent({ body: 'lf content' });
                var lfOpine = new LivefyreOpine({
                    type: 1,
                    vis: 1,
                    author: { id: mockAuthResponse.data.profile.id }
                });
                lfContent.addOpine(lfOpine);
                var lfContentView = contentViewFactory.createContentView(lfContent);
                lfContentView.render();

                expect(lfContentView.$el.find('.hub-btn-toggle-on')).toHaveLength(1);
            });
        });

        describe('opts.shareCommand', function () {
            var shareButtonSelector = '.hub-content-share';
            function getShareEl(contentView) {
                return contentView.$el.find(shareButtonSelector);
            }
            function hasShareButton(contentView) {
                return Boolean(getShareEl(contentView).length);
            }
            function contentViewWithShareCommand(shareCommand) {
                return new LivefyreContentView({
                    content: new Content('blah'),
                    shareCommand: shareCommand
                });
            }
            function createCommand(onExecute) {
                return new Command(onExecute || function () {});
            }
            it('if not passed, share button does not appear', function () {
                var contentView = new LivefyreContentView({
                    content: new Content('blah')
                });
                contentView.render();
                expect(hasShareButton(contentView)).toBe(false);
            });
            it('share button appears if passed and canExecute', function () {
                var command = createCommand();
                command.canExecute = function () { return true; };
                var contentView = contentViewWithShareCommand(command);
                contentView.render();
                expect(hasShareButton(contentView)).toBe(true);
            });
            it('share button does not appear if passed and not canExecute', function () {
                var command = createCommand();
                command.canExecute = function () { return false; };
                var contentView = contentViewWithShareCommand(command);
                contentView.render();
                expect(hasShareButton(contentView)).toBe(false);
            });
            it('is executed when the share button is clicked', function () {
                var execute = jasmine.createSpy();
                var command = createCommand(execute);
                command.canExecute = function () { return true; };
                var contentView = contentViewWithShareCommand(command);
                contentView.render();
                expect(hasShareButton(contentView)).toBe(true);
                // Click the button
                getShareEl(contentView).click();
                expect(execute).toHaveBeenCalled();
            });
            it('shows the button once the command becomes executable', function () {
                var execute = jasmine.createSpy();
                var command = createCommand(execute);
                command.disable();
                var contentView = contentViewWithShareCommand(command);
                contentView.render();
                expect(hasShareButton(contentView)).toBe(false);
                // now enable it
                command.enable();
                expect(hasShareButton(contentView)).toBe(true);
            });
        });

    });
});

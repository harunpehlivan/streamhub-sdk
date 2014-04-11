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
    'streamhub-sdk/collection/liker',
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
    Liker,
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
                user,
                contentViewFactory;

            beforeEach(function () {
                // Auth mock user
                mockUserFactory = new MockUserFactory();
                user = mockUserFactory.createUser();
                auth.login({ livefyre: user});
                contentViewFactory = new ContentViewFactory();
            });

            afterEach(function () {
                auth.logout();
            });

            it("only renders for non-Twitter content items", function () {
                var twitterContent = new LivefyreTwitterContent({
                    id: 'tweet-1234@twitter.com',
                    body: 'tweet i am',
                    author: {
                        id: 'jimmy@twitter.com'
                    }
                });
                var twitterContentView = contentViewFactory.createContentView(twitterContent, {
                    liker: new Liker()
                });
                twitterContentView.render();

                expect(twitterContentView.$el.find('.hub-content-like')).toHaveLength(0);

                var lfContent = new LivefyreContent({ body: 'lf content' });
                var lfContentView = contentViewFactory.createContentView(lfContent, {
                    liker: new Liker()
                });
                lfContentView.render();

                expect(lfContentView.$el.find('.hub-content-like')).toHaveLength(1);
            });

            it("is in the toggle off state when not liked by authenticated user", function () {
                var lfContent = new LivefyreContent({ body: 'lf content' });
                var lfContentView = contentViewFactory.createContentView(lfContent, {
                    liker: new Liker()
                });
                lfContentView.render();

                expect(lfContentView.$el.find('.hub-btn-toggle-off')).toHaveLength(1);
            });

            it("is in the toggle on state when liked by authenticated user", function () {
                var lfContent = new LivefyreContent({ body: 'lf content' });
                var lfOpine = new LivefyreOpine({
                    type: 1,
                    vis: 1,
                    author: { id: mockAuthResponse.data.profile.id }
                });
                lfContent.addOpine(lfOpine);
                var lfContentView = contentViewFactory.createContentView(lfContent, {
                    liker: new Liker()
                });
                lfContentView.render();

                expect(lfContentView.$el.find('.hub-btn-toggle-on')).toHaveLength(1);
            });

            it("updates the label when a 'opine' event is emitted on the associated content", function () {
                var lfContent = new LivefyreContent({ body: 'lf content' });
                var lfContentView = contentViewFactory.createContentView(lfContent, {
                    liker: new Liker()
                });
                lfContentView.render();

                spyOn(lfContentView._likeButton, 'updateLabel');

                // Add like
                var lfOpine = new LivefyreOpine({
                    type: 1,
                    vis: 1,
                    author: { id: mockAuthResponse.data.profile.id }
                });
                lfContent.addOpine(lfOpine);

                expect(lfContentView._likeButton.updateLabel).toHaveBeenCalled();
            });

            it("updates the label when a 'removeOpine' event is emitted on the associated content", function () {
                var lfContent = new LivefyreContent({ body: 'lf content' });
                var lfContentView = contentViewFactory.createContentView(lfContent, {
                    liker: new Liker()
                });
                lfContentView.render();

                // Add like
                var lfOpine = new LivefyreOpine({
                    type: 1,
                    vis: 1,
                    author: { id: mockAuthResponse.data.profile.id }
                });
                lfContent.addOpine(lfOpine);

                spyOn(lfContentView._likeButton, 'updateLabel');

                // Remove like
                lfContent.removeOpine(lfOpine);

                expect(lfContentView._likeButton.updateLabel).toHaveBeenCalled();
            });

            it("cannot execute when the Like button's associated content is authored by the authenticated user (cannot Like own content)", function () {
                var lfContent = new LivefyreContent({
                    body: 'lf content',
                    author: { id: mockAuthResponse.data.profile.id }
                });

                // Add like
                var lfOpine = new LivefyreOpine({
                    type: 1,
                    vis: 1,
                    author: { id: mockAuthResponse.data.profile.id }
                });
                lfContent.addOpine(lfOpine);

                var lfContentView = contentViewFactory.createContentView(lfContent, {
                    liker: new Liker()
                });
                lfContentView.render();

                expect(lfContentView._commands.like._canExecute).toBe(false);
            });

            it("can execute when the Like button's associated content is not authored by the authenticated user (can Like other users' content)", function () {
                var lfContent = new LivefyreContent({
                    body: 'lf content',
                    author: { id: 'datdude@blah' }
                });

                // Add like
                var lfOpine = new LivefyreOpine({
                    type: 1,
                    vis: 1,
                    author: { id: mockAuthResponse.data.profile.id }
                });
                lfContent.addOpine(lfOpine);

                var lfContentView = contentViewFactory.createContentView(lfContent, {
                    liker: new Liker()
                });
                lfContentView.render();

                expect(lfContentView._commands.like._canExecute).toBe(true);
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

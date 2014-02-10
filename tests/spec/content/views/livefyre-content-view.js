define([
    'jquery',
    'auth',
    'livefyre-auth',
    'livefyre-auth/livefyre-auth-delegate',
    'livefyre-auth-tests/mocks/mock-user-factory',
    'json!livefyre-auth-tests/mocks/auth-response.json',
    'streamhub-sdk/util',
    'streamhub-sdk/content',
    'streamhub-sdk/content/types/livefyre-content',
    'streamhub-sdk/content/types/livefyre-twitter-content',
    'streamhub-sdk/content/views/livefyre-content-view',
    'streamhub-sdk/content/content-view-factory',
    'streamhub-sdk/collection/clients/write-client',
    'streamhub-sdk/content/views/tiled-attachment-list-view'],
function (
    $,
    util,
    Content,
    LivefyreContent,
    LivefyreTwitterContent,
    LivefyreContentView,
    ContentViewFactory,
    LivefyreWriteClient,
    TiledAttachmentListView) {
    'use strict';

    describe('LivefyreContentView', function () {

        describe('Like button', function () {

            it("only renders for non-Twitter content items", function () {
                var contentViewFactory = new ContentViewFactory();

            beforeEach(function () {
                // Auth mock user
                mockUserFactory = new MockUserFactory();
                user = mockUserFactory.createUser();
                auth.delegate({
                    login: function (done) { done(); },
                    logout: function (done) { done(); }
                });
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
                var twitterContentView = contentViewFactory.createContentView(twitterContent);
                twitterContentView.render();

                expect(twitterContentView.$el.find('.hub-content-like')).toHaveLength(0);

                var lfContent = new LivefyreContent({ body: 'lf content' });
                var lfContentView = contentViewFactory.createContentView(lfContent);
                lfContentView.render();

                expect(lfContentView.$el.find('.hub-content-like')).toHaveLength(1);
            });

            describe('when Like button clicked', function () {
                var content,
                    contentView,
                    likeButtonEl;

                beforeEach(function () {
                    content = new LivefyreContent({ body: 'what' });
                    contentView = new LivefyreContentView({ content: content });
                    contentView.render();
                    likeButtonEl = contentView.$el.find('.hub-content-like');
                });

                afterEach(function () {
                    $('body').off();
                });

                it("lazily attaches an event listener for 'contentLike.hub' event on body element", function () {
                    expect($._data($('body')[0], 'events')).toBe(undefined);
                    likeButtonEl.trigger('click');
                    expect($._data($('body')[0], 'events').contentLike.length).toBe(1);
                });

                it("sets #_likeRequestListener flag to true", function () {
                    expect(contentView._likeRequestListener).toBe(false);
                    likeButtonEl.trigger('click');
                    expect(contentView._likeRequestListener).toBe(true);
                });
            });

            describe("body element 'contentLike.hub' listener", function () {
                var content,
                    contentView,
                    likeButtonEl;

                beforeEach(function () {
                    content = new Content({ body: 'what' });
                    contentView = new LivefyreContentView({ content: content });
                    contentView.render();
                    likeButtonEl = contentView.$el.find('.hub-content-like');
                });

                afterEach(function () {
                    $('body').off();
                });

                lfContentView._likeButton.$el.click();
                expect(lfContentView._likeButton._label).toBe(0);
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
                    content: new LivefyreContent({ body: 'blah' }),
                    shareCommand: shareCommand
                });
            }
            function createCommand(onExecute) {
                return new Command(onExecute || function () {});
            }

            it('if sharer delegate is undefined, share button does not appear', function () {
                expect(sharer.hasDelegate()).toBe(false);
                var contentView = new LivefyreContentView({
                    content: new Content('blah')
                });
                contentView.render();
                expect(hasShareButton(contentView)).toBe(false);
            });
            it('share button appears if passed and canExecute and share delegate is set', function () {
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
                lfContentView._likeButton.$el.click();
                expect(lfContentView._likeButton._label).toBe(0);
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
                    content: new LivefyreContent(),
                    shareCommand: shareCommand
                });
            }
            function createCommand(onExecute) {
                return new Command(onExecute || function () {});
            }

            it('if sharer delegate is undefined, share button does not appear', function () {
                expect(sharer.hasDelegate()).toBe(false);
                var contentView = new LivefyreContentView({
                    content: new Content('blah')
                });
                contentView.render();
                expect(hasShareButton(contentView)).toBe(false);
            });
            it('share button appears if passed and canExecute and share delegate is set', function () {
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
            // (from bengo) This is disabled because it's currently a rare/weird case.
            // and doesn't work. But we may want it someday.
            // But it will take some refactoringish stuff to ContentView
            xit('shows the button once the command becomes executable', function () {
                var execute = jasmine.createSpy();
                var command = createCommand(execute);
                command.disable();
                var contentView = contentViewWithShareCommand(command);
                contentView.render();
                expect(hasShareButton(contentView)).toBe(false);
                // now enable it
                command.enable();
                expect(hasShareButton(contentView)).toBe(true);
                //it('creates a LivefyreWriteClient instance', function () {
                //    expect(this._writeClient).toBeUndefined();
                //    likeButtonEl.trigger('click');
                //    expect($._data($('body')[0], 'events').contentLike.length).toBe(1);
                //    console.log($._data($('body')[0], 'events'));
                //    expect(this._writeClient).not.toBeUndefined();
                //    expect(this._writeClient instanceof LivefyreWriteClient).toBe(true);
                //});
            });
        });

    });
});

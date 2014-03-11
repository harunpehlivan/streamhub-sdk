'use strict';

var Content = require('streamhub-sdk/content');
var ContentView = require('streamhub-sdk/content/views/content-view');
var fetch = require('streamhub-sdk/content/fetcher');

describe('streamhub-sdk/content/fetcher', function () {
    it('is an object', function () {
        expect(typeof(fetch)).toBe('object');
    });
    
    it('has content() and contentView() methods', function () {
        expect(typeof(fetch.content)).toBe('function');
        expect(typeof(fetch.contentView)).toBe('function');
    });
    
    it('works like this', function () {
        var spy = jasmine.createSpy('callback');
        var opts = {
            network: 'livefyre.com',
            environment: 't402.livefyre.com',
            collectionId: '10772933',
            contentId: '26482715'
        };

        fetch.content(opts, spy);
        waitsFor(function () {
            return spy.wasCalled;
        }, 'callback spy to be called', 1000);
        runs(function () {
            expect(spy).toHaveBeenCalled();
        });
    });
    
    describe('.content()', function () {
        it('passes a Content object as the second parameter to the callback when successful', function () {
            throw 'TODO (joao) Implement this!';
        });
        
        it('passes an error as the first parameter to the callback when it fails', function () {
            throw 'TODO (joao) Implement this!';
        });
        
        it('Takes a callback(err, data) as its second parameter', function () {
            throw 'TODO (joao) Implement this!';
        });
        
        it('requires opts.collectionId and opts.contentId to know what content state to grab', function () {
            throw 'TODO (joao) Implement this!';
        });
        
        it('requires opts.network to know where to look for content state', function () {
            throw 'TODO (joao) Implement this!';
        });
        
        it('optionally allows opts.environment', function () {
            throw 'TODO (joao) Implement this!';
        });
        
        it('will not return child replies if opts.depthOnly is true', function () {
            throw 'TODO (joao) Implement this!';
        });
    });
    
    describe(' .contentView()', function  () {
        it('passes a ContentView object as the second parameter to the callback when successful', function () {
            throw 'TODO (joao) Implement this!';
        });
        
        it('passes an error as the first parameter to the callback when it fails', function () {
            throw 'TODO (joao) Implement this!';
        });
        
        it('Takes a callback(err, data) as its second parameter', function () {
            throw 'TODO (joao) Implement this!';
        });
        
        it('wraps fetch.content() and passes its parameters', function () {
            throw 'TODO (joao) Implement this!';
        });
    });
});

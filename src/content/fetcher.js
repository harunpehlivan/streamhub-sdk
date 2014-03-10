var Collection = require('streamhub-sdk/collection');
var ContentClient = require('streamhub-sdk/content/clients/content-client');
var ContentViewFactory = require('streamhub-sdk/content/content-view-factory');
var StateToContent = require('streamhub-sdk/content/state-to-content');
var util = require('streamhub-sdk/util');

'use strict';

var fetch = {};

fetch.content = function (opts, callback) {
    opts = opts || {};
    opts.autoCreate = false;
    callback = callback || util.nullFunction;
    var client = new ContentClient();
    fetch._collection = new Collection(opts);
    client.getContent(opts, clbk);
    
    var self = fetch;
    function clbk(err, data) {
        if (err) {
            callback(err);
            return;
        }
        
        var states = data.content || [],
            state,
            content,
            contents = [];
        
        opts = opts || {};
        opts.replies = true;
        opts.authors = data.authors;
        opts.collection = self._collection;
        //opts.collection?
        var trans = new StateToContent(opts);
        trans.on('data', function (content) {
            contents.push(content);

            if (contents.length === statesCount) {
                for (var j=0; j < statesCount; j++) {
                    if (contents[j].id === opts.contentId) {//Must be strings
                        callback(undefined, contents[j]);
                        return;
                    }
                }
            }
        });

        for (var i=0, statesCount=states.length; i < statesCount; i++) {
            state = states[i];
            trans.write(state);
        }
    }
};

fetch.contentView = function (opts, callback) {
    callback = callback || util.nullFunction;
    fetch.content(opts, clbk);
    
    function clbk(err, data) {
        if (err) {
            callback(err);
            return;
        }
        
        var factory = new ContentViewFactory();
        callback(undefined, factory.createContentView(data));
    }
};

module.exports = fetch;

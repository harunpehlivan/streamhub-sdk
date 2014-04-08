var Content = require('streamhub-sdk/content');
var LivefyreContentClient = require('streamhub-sdk/content/clients/content-client');
var StateToContent = require('streamhub-sdk/content/state-to-content');

'use strict';

/**
 * 
 * @param opts {!object}
 * @param opts.network {!string}
 * @param opts.collectionId {!string}
 * @param opts.contentId {!string}
 * @param [opts.environment] {string=}
 * @param [opts.replies] {boolean=} Default is true.
 * @param [opts.depthOnly] {boolean=} Default is false.
 * @param callback {!function(err: Object, data: Content)}
 */
var fetchContent = function (opts, callback) {
    if (!opts) {
        throw 'Can\'t fetchContent() without specifying opts';
    }
    if (!opts.collectionId || !opts.network || !opts.contentId) {
        throw 'Can\'t fetchContent() without network, collectionId and contentId';
    }
    if (!callback) {
        throw 'Can\'t fetchContent() without specifying a callback';
    }
    //build opts for content client and state to content
    opts.replies = opts.replies || true;
    opts.depthOnly = opts.depthOnly || false;

    //Send the request
    this._contentClient.getContent(opts, clbk);
    
    function clbk(err, data) {
        if (err) {
            callback(err);
            return;
        }
        
        var states = data.content || [],
            state,
            content,
            contents = [];
        
        //Prepare StateToContents to handle the recieved states
        opts.authors = data.authors;
        var trans = new StateToContent(opts);
        
        //Listen for states that have been transformed into Content
        trans.on('data', function (content) {
            contents.push(content);

            //Once we've recieved as many as we've written, find the desired
            //Content and send it to the callback.
            if (contents.length === statesCount) {
                for (var j=0; j < statesCount; j++) {
                    if (contents[j] && contents[j].id === contentId) {//Must be strings
                        callback(undefined, contents[j]);
                        return;
                    }
                }
                //If we get here, something went very wrong.
                callback('ERROR');
            }
        });

        //Write each state into StateToContent
        for (var i=0, statesCount=states.length; i < statesCount; i++) {
            state = states[i];
            trans.write(state);
        }
    }
};

module.exports = fetchContent;

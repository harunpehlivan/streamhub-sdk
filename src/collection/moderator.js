define([
    'streamhub-sdk/auth',
    'streamhub-sdk/collection/clients/write-client',
], function (Auth, LivefyreWriteClient) {
    'use strict';

    var Moderator = function (opts) {
        opts = opts || {};
        this._writeClient = opts.writeClient || new LivefyreWriteClient();
    };

    Moderator.prototype.trash = function (opts, callback) {
        this._writeClient.trashContent({
            contentId: opts.content.id,
            siteId: opts.content.collection.siteId,
            collectionId: opts.content.collection.id,
            network: opts.content.collection.network,
            lftoken: Auth.getToken()
        }, callback);
    };

    return Moderator;
});

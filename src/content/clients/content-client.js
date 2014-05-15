 * @param opts.contentId {!string} The commentId to fetch content from
 * @param [opts.depthOnly] {boolean} False by default. Set to true to return all
 *      replies to the specified contentId
 * @param [opts.environment] {string} Optional livefyre environment to use dev/prod environment
 * @param callback {function} A callback that is called upon success/failure of the
 *      stream request. Callback signature is "function(error, data)".
 */
LivefyreContentClient.prototype.getContent = function(opts, callback) {
    opts = opts || {};
    callback = callback || function() {};

    var url = [
        this._getUrlBase(opts),
        "/api/v3.0/content/thread/"
    ].join("");

    var request = this._request({
        url: url,
        data: {
            collection_id: opts.collectionId,
            content_id: opts.contentId,
            depth_only: opts.depthOnly || false
        }
    }, function (err, data) {
        if (err) {
            return callback.apply(this, arguments);
        }
        if (data.status === 'error') {
            return callback(data.msg);
        }
        callback(null, data.data);
    });

    return request;
};

module.exports = LivefyreContentClient;
 * @param opts.contentId {!string} The commentId to fetch content from (default "0")
 * @param [opts.depthOnly] {boolean} False by default. Set to true to return all
 *      replies to the specified contentId
 * @param [opts.environment] {string} Optional livefyre environment to use dev/prod environment
 * @param callback {function} A callback that is called upon success/failure of the
 *      stream request. Callback signature is "function(error, data)".
 */
LivefyreContentClient.prototype.getContent = function(opts, callback) {
    opts = opts || {};
    callback = callback || function() {};

    var url = [
        this._getUrlBase(opts),
        "/api/v3.0/content/thread/"
    ].join("");

    var request = this._request({
        url: url,
        data: {
            collection_id: opts.collectionId,
            content_id: opts.contentId,
            depth_only: opts.depthOnly || false
        }
    }, function (err, data) {
        if (err) {
            return callback.apply(this, arguments);
        }
        if (data.timeout) {
            return callback(null, { timeout: data.timeout });
        }
        if (data.status === 'error') {
            return callback(data.msg);
        }
        callback(null, data.data);
    });

    return request;
};

module.exports = LivefyreContentClient;

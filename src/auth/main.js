define(['auth', 'inherits', 'event-emitter', 'streamhub-sdk/debug'],
function (auth, inherits, EventEmitter, debug) {
    'use strict';


    var log = debug('streamhub-sdk/auth');


    /**
     * An object that knows about the authenticated user
     */
    var Auth = new EventEmitter();

    Auth._onUserLogin = function () {
        var token = this.getDelegate().getUser().get('token');
        this.setToken(token);
    }.bind(Auth);

    /**
     * Set the Auth token
     * @deprecated
     * @param token {string} A Livefyre authentication token,
     *     as described at http://bit.ly/17SYaoT
     */
    Auth.setToken = function (token) {
        log('.setToken', token);
        this._token = token;
        this.emit('token', token);
    };


    /**
     * Get the Auth token
     * @deprecated
     * @return A token, if one has been set, else undefined
     */
    Auth.getToken = function () {
        return this._token;
    };

    /**
     * Set the Auth delegate
     * @param authDelegate {AuthDelegate} A auth delegate instance
     */
    Auth.setDelegate = function (authDelegate) {
        if (this._delegate) {
            // remove old listener
            this._delegate.getUser().removeListener('login', this._onUserLogin);
        }
        this._delegate = authDelegate;
        this._delegate.getUser().on('login', this._onUserLogin);
        this.emit('delegate', authDelegate);
    };

    /**
     * Get the Auth delegate
     * @return An auth delegate, if one has been set, else undefined
     */
    Auth.getDelegate = function () {
        return this._delegate;
    };


    /**
     * Get the user id for from the Auth token
     */
    Auth.getToken = function () {
        var livefyreUser = auth.get('livefyre');
        if ( ! livefyreUser) {
            return this._token;
        }
        return livefyreUser.get('token');
    };

    /**
     * An Error that represents that an operation could not be performed
     * because the user has not been authorized. Semantics like HTTP 401
     */
    var UnauthorizedError = function (message) {
        Error.apply(this, arguments);
        this.message = message;
    };
    inherits(UnauthorizedError, Error);
    UnauthorizedError.prototype.name = "UnauthorizedError";

    /**
     * An Error that represents that an operation could not be performed
     * because the user has not been authorized. Semantics like HTTP 401
     */
    var UnauthorizedError = function (message) {
        Error.apply(this, arguments);
        this.message = message;
    };
    inherits(UnauthorizedError, Error);
    UnauthorizedError.prototype.name = "UnauthorizedError";

    Auth.UnauthorizedError = UnauthorizedError;
    return Auth;
});

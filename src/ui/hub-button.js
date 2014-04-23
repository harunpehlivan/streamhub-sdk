'use strict';

var Button = require('streamhub-sdk/ui/button');
var Command = require('streamhub-sdk/ui/command');
var inherits = require('inherits');
var hubButtonCss = require('text!streamhub-sdk/ui/css/hub-button.css');
var GUID = require('guid');
var rework = require('rework');
var $ = require('streamhub-sdk/jquery');

function prefixedHubButtonCss(prefix, separator) {
    var css = rework(hubButtonCss)
      .use(rework.prefixSelectors(prefix, separator))
      .toString();
    return css;
}

function insertStyleEl(css, id) {
    var $style = $('<style>'+css+'</style>');
    if (id) {
        $style.attr('id', id);
    }
    $style.appendTo('head');
    return $style[0];
}

function insertGuidCss(guid) {
    var htmlAttr = GUID.htmlAttr(guid);
    var prefixedCss = prefixedHubButtonCss('.'+htmlAttr, '');
    var styleEl = insertStyleEl(prefixedCss, htmlAttr);
    return styleEl;
}

/**
 * Create a button prefixed with classes prefixed with 'hub-'
 * @param [opts.guidClass=true] {boolean} Whether to add a GUID class for the
 *    default styles to work
 */
function HubButton (fnOrCommand, opts) {
    opts = opts ? Object.create(opts) : {};
    opts.guidClass = 'guidClass' in opts ? opts.guidClass : true;
    // Add the GUID to all els so this class' custom styling takes effect
    if (opts.guidClass) {
        opts.elClassNoPrefix = (opts.elClassNoPrefix || '') + ' ' + GUID.htmlAttr(HubButton.guid);
    }

    this._buttonUrl = opts.buttonUrl;
    if (this._buttonUrl) {
        fnOrCommand = function () {};
    }

    var command;
    if (typeof(fnOrCommand) === 'function') {
        command = new Command(fnOrCommand);
    } else if (fnOrCommand) {
        command = fnOrCommand;
    }
    Button.call(this, command, opts);
}
inherits(HubButton, Button);

// This ListView class may not be the only one running on the page
// (e.g. different versions). So generate a GUID for this one.
// And we'll add it as a CSS class on all instances
HubButton.guid = GUID();
var hubButtonStyleEl = insertGuidCss(HubButton.guid);

HubButton.prototype.elClassPrefix = 'hub';

HubButton.prototype.getTemplateContext = function () {
    var context = Button.prototype.getTemplateContext.call(this);
    context.buttonUrl = this._buttonUrl;

    return context;
};

module.exports = HubButton;

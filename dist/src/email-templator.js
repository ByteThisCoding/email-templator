"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailTemplator = void 0;
/**
 * Generate email markup based on an input string with {{style/value}} type marks
 * + style definitions
 * + other interpolations
 */
var EmailTemplator = /** @class */ (function () {
    function EmailTemplator() {
    }
    EmailTemplator.prototype.generateMarkup = function (modifiedHtmlTemplate, styleDeclarations, interpolationValues) {
        var styleFields = this.processStyleFields(styleDeclarations);
        var fields = __assign(__assign({}, styleFields), interpolationValues);
        //for each key/value, look through the template and replace everything
        var reg = function (key) { return new RegExp("{{\\s*" + key + "\\s*}}", "g"); };
        var anyExists = function () {
            var allReg = Object.keys(fields).map(reg);
            return !!allReg.find(function (reg) { return !!modifiedHtmlTemplate.match(reg); });
        };
        //do while loop, just in case there are any nested keys to replace
        do {
            Object.keys(fields).forEach(function (key) {
                modifiedHtmlTemplate = modifiedHtmlTemplate.replace(reg(key), fields[key]);
            });
        } while (anyExists());
        return modifiedHtmlTemplate;
    };
    /**
     * Look over the style fields, handle some special style types, and compress to a single string
     * @param styleDeclarations
     * @returns
     */
    EmailTemplator.prototype.processStyleFields = function (styleDeclarations) {
        var _this = this;
        return Object.keys(styleDeclarations).reduce(function (obj, key) {
            var styleStr = styleDeclarations[key];
            var propMatches = "";
            _this.analyzeStyles(styleDeclarations[key]);
            //try to match to a style => property
            //if it doesn't match, inline the style as normal
            var styleProps = [
                {
                    match: /(?<!(line|max)-)height:\s*[0-9]+px;?/g,
                    attr: function (matchStr) {
                        return "height=\"" + matchStr.replace(/[^0-9]/g, "") + "\"";
                    },
                },
                {
                    match: /(?<!(line|max)-)width:\s*[0-9]+px;?/g,
                    attr: function (matchStr) {
                        return "width=\"" + matchStr.replace(/[^0-9]/g, "") + "\"";
                    },
                },
            ];
            styleProps.forEach(function (sp) {
                var matches = styleStr.match(sp.match);
                (matches || []).forEach(function (match) {
                    var attr = sp.attr(match);
                    propMatches += attr + " ";
                    //styleStr = styleStr.replace(match, "");
                });
            });
            //return a string "style=" with the processed styles inlined
            obj[key] =
                " style=\"" +
                    styleStr.replace(/\s+/g, " ").trim() +
                    ("\" " + propMatches);
            return obj;
        }, {});
    };
    /**
     * Provide some warnings to the user based on what styles appear
     * @param styleContents
     */
    EmailTemplator.prototype.analyzeStyles = function (styleContents) {
        if (!!styleContents.match(/display:\s*(inline-)?flex/i)) {
            console.warn("Warning in email-templator: email clients have limited support for flex displays. Consider using an alternative.");
        }
    };
    return EmailTemplator;
}());
exports.EmailTemplator = EmailTemplator;

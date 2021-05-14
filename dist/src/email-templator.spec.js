"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var email_templator_1 = require("./email-templator");
describe("EmailTemplator", function () {
    var templator = new email_templator_1.EmailTemplator();
    it("should output initial markup if no other paramms provided", function () {
        var input = "<h1>Test</h1>";
        var markup = templator.generateMarkup(input, {}, {});
        expect(markup).toBe(input);
    });
    it("should correctly interpolate non style values", function () {
        var input = "<h1>{{title}}</h1><p>{{ body }}</p>";
        var values = {
            title: "Test",
            body: "This is a test"
        };
        var markup = templator.generateMarkup(input, {}, values);
        expect(markup).not.toBe(input);
        expect(markup.indexOf(values.title)).toBeGreaterThan(-1);
        expect(markup.indexOf(values.body)).toBeGreaterThan(-1);
    });
    it("should correctly interpolate style values", function () {
        var input = "<h1 {{#main-header}}>Test</h1><p {{.paragraph-style-class}}>Test paragraph</p>";
        var styles = {
            '#main-header': "\n                font-weight: bold;\n                width: 500px;\n            ",
            '.paragraph-style-class': "\n                color: purple;\n                font-weight: bold;\n            "
        };
        var markup = templator.generateMarkup(input, styles, {});
        expect(markup).not.toBe(input);
        expect(markup.indexOf("style=")).toBeGreaterThan(-1);
        expect(markup.indexOf("font-weight: bold")).toBeGreaterThan(-1);
        expect(markup.indexOf("color: purple")).toBeGreaterThan(-1);
        expect(markup.indexOf("width: 500px")).toBeGreaterThan(-1);
        expect(markup.indexOf("width=\"500\"")).toBeGreaterThan(-1);
        expect(markup.indexOf("#main-header")).toBe(-1);
        expect(markup.indexOf(".paragraph-style-class")).toBe(-1);
    });
    it("should correctly interpolate styles and other values", function () {
        var input = "<h1 {{#main-header}}>{{ title }}</h1><p {{.paragraph-style-class}}>{{ body }}</p>";
        var styles = {
            '#main-header': "\n                font-weight: bold;\n                width: 500px;\n                height: 200px;\n            ",
            '.paragraph-style-class': "\n                color: purple;\n                font-weight: bold;\n            "
        };
        var values = {
            title: "Test",
            body: "This is a test"
        };
        var markup = templator.generateMarkup(input, styles, values);
        expect(markup).not.toBe(input);
        expect(markup.indexOf("style=")).toBeGreaterThan(-1);
        expect(markup.indexOf("font-weight: bold")).toBeGreaterThan(-1);
        expect(markup.indexOf("color: purple")).toBeGreaterThan(-1);
        expect(markup.indexOf("width: 500px")).toBeGreaterThan(-1);
        expect(markup.indexOf("width=\"500\"")).toBeGreaterThan(-1);
        expect(markup.indexOf("height: 200px")).toBeGreaterThan(-1);
        expect(markup.indexOf("height=\"200\"")).toBeGreaterThan(-1);
        expect(markup.indexOf("#main-header")).toBe(-1);
        expect(markup.indexOf(".paragraph-style-class")).toBe(-1);
        expect(markup.indexOf(values.title)).toBeGreaterThan(-1);
        expect(markup.indexOf(values.body)).toBeGreaterThan(-1);
    });
});

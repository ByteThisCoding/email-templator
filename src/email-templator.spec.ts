import { EmailTemplator } from "./email-templator"

describe("EmailTemplator", () => {

    const templator = new EmailTemplator();

    it("should output initial markup if no other paramms provided", () => {

        const input = "<h1>Test</h1>";
        const markup = templator.generateMarkup(input, {}, {});

        expect(markup).toBe(input);

    });

    it("should correctly interpolate non style values", () => {

        const input = "<h1>{{title}}</h1><p>{{ body }}</p>";
        const values = {
            title: "Test",
            body: "This is a test"
        };

        const markup = templator.generateMarkup(input, {}, values);
        expect(markup).not.toBe(input);
        expect(markup.indexOf(values.title)).toBeGreaterThan(-1);
        expect(markup.indexOf(values.body)).toBeGreaterThan(-1);
    });

    it("should correctly interpolate style values", () => {

        const input = "<h1 {{#main-header}}>Test</h1><p {{.paragraph-style-class}}>Test paragraph</p>";
        const styles = {
            '#main-header': `
                font-weight: bold;
                width: 500px;
            `,
            '.paragraph-style-class': `
                color: purple;
                font-weight: bold;
            `
        };

        const markup = templator.generateMarkup(input, styles, {});
        expect(markup).not.toBe(input);

        expect(markup.indexOf("style=")).toBeGreaterThan(-1);
        expect(markup.indexOf("font-weight: bold")).toBeGreaterThan(-1);
        expect(markup.indexOf("color: purple")).toBeGreaterThan(-1);
        expect(markup.indexOf("width: 500px")).toBeGreaterThan(-1);
        expect(markup.indexOf("width=\"500\"")).toBeGreaterThan(-1);
        
        expect(markup.indexOf("#main-header")).toBe(-1);
        expect(markup.indexOf(".paragraph-style-class")).toBe(-1);

    });

    it("should correctly interpolate styles and other values", () => {

        const input = "<h1 {{#main-header}}>{{ title }}</h1><p {{.paragraph-style-class}}>{{ body }}</p>";
        const styles = {
            '#main-header': `
                font-weight: bold;
                width: 500px;
                height: 200px;
            `,
            '.paragraph-style-class': `
                color: purple;
                font-weight: bold;
            `
        };
        const values = {
            title: "Test",
            body: "This is a test"
        };

        const markup = templator.generateMarkup(input, styles, values);
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

})
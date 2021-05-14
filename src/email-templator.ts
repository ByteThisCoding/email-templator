import { iEmailTemplator } from "./models/email-templator";
/**
 * Generate email markup based on an input string with {{style/value}} type marks
 * + style definitions
 * + other interpolations
 */

export class EmailTemplator implements iEmailTemplator {

    generateMarkup(
        modifiedHtmlTemplate: string,
        styleDeclarations: { [key: string]: string },
        interpolationValues: { [key: string]: string }
    ): string {
        const styleFields = this.processStyleFields(styleDeclarations);
        const fields: any = {
            ...styleFields,
            ...interpolationValues,
        };

        //for each key/value, look through the template and replace everything
        const reg = (key: string) => new RegExp(`{{\\s*${key}\\s*}}`, "g");
        const anyExists = () => {
            const allReg = Object.keys(fields).map(reg);
            return !!allReg.find((reg) => !!modifiedHtmlTemplate.match(reg));
        };

        //do while loop, just in case there are any nested keys to replace
        do {
            Object.keys(fields).forEach((key) => {
                modifiedHtmlTemplate = modifiedHtmlTemplate.replace(
                    reg(key),
                    fields[key]
                );
            });
        } while (anyExists());
        return modifiedHtmlTemplate;
    }

    /**
     * Look over the style fields, handle some special style types, and compress to a single string
     * @param styleDeclarations 
     * @returns 
     */
    private processStyleFields(styleDeclarations: { [key: string]: string }): {
        [key: string]: string;
    } {
        return Object.keys(styleDeclarations).reduce((obj, key) => {
            let styleStr = styleDeclarations[key];
            let propMatches = "";

            this.analyzeStyles(styleDeclarations[key]);
            

            //try to match to a style => property
            //if it doesn't match, inline the style as normal
            const styleProps = [
                {
                    match: /(?<!(line|max)-)height:\s*[0-9]+px;?/g,
                    attr: (matchStr: string) =>
                        `height="${matchStr.replace(/[^0-9]/g, "")}"`,
                },
                {
                    match: /(?<!(line|max)-)width:\s*[0-9]+px;?/g,
                    attr: (matchStr: string) =>
                        `width="${matchStr.replace(/[^0-9]/g, "")}"`,
                },
            ];

            styleProps.forEach((sp) => {
                const matches = styleStr.match(sp.match);
                (matches || []).forEach((match) => {
                    const attr = sp.attr(match);
                    propMatches += attr + " ";
                    //styleStr = styleStr.replace(match, "");
                });
            });

            //return a string "style=" with the processed styles inlined
            obj[key] =
                ` style="` +
                styleStr.replace(/\s+/g, " ").trim() +
                `" ${propMatches}`;
            return obj;
        }, {} as { [key: string]: string });
    }

    /**
     * Provide some warnings to the user based on what styles appear
     * @param styleContents 
     */
    private analyzeStyles(styleContents: string): void {
        if (!!styleContents.match(/display:\s*(inline-)?flex/i)) {
            console.warn("Warning in email-templator: email clients have limited support for flex displays. Consider using an alternative.");
        }
    }
}
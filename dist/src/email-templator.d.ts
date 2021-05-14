import { iEmailTemplator } from "./models/email-templator";
/**
 * Generate email markup based on an input string with {{style/value}} type marks
 * + style definitions
 * + other interpolations
 */
export declare class EmailTemplator implements iEmailTemplator {
    generateMarkup(modifiedHtmlTemplate: string, styleDeclarations: {
        [key: string]: string;
    }, interpolationValues: {
        [key: string]: string;
    }): string;
    /**
     * Look over the style fields, handle some special style types, and compress to a single string
     * @param styleDeclarations
     * @returns
     */
    private processStyleFields;
    /**
     * Provide some warnings to the user based on what styles appear
     * @param styleContents
     */
    private analyzeStyles;
}

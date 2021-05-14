export interface iEmailTemplator {

    generateMarkup(
        modifiedHtmlTemplate: string,
        styleDeclarations: { [key: string]: string },
        interpolationValues: { [key: string]: string }
    ): string;

}
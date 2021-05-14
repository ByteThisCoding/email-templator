# email-templator
![Coverage lines](./coverage/badge-lines.svg)
![Coverage functions](./coverage/badge-functions.svg)
![Coverage branches](./coverage/badge-branches.svg)
![Coverage statements](./coverage/badge-statements.svg)

An api which makes email markup generation a bit easier to deal with. Creating email html is a but cumbersome, as email clients haved mixed support for certain styling attributes, especially more modern ones.

This email-templator:
* interpolates values based on input dictionary, similar to Angular interpolation syntax
* process and interpolate css style declarations to inline them for each element
* give console warnings for potentially problematic css style rules


## How To Use
You will need two or three of the following:
1. Email html template
2. Dictionary of styles
3. Dictionary of other interpolation values

The styles and interpolation values will be denoted as {{ <key name> }}, similar to Angular interpolation (note that this is not an Angular library and does not support directives, templates, etc).

The following is an example:
```javascript
/**
 * Here is some basic markup to be sent as a greeting to a new user.
 * 
 * Notice that we have some interpolation going on:
 * --> #main-header, personFullName, .excited-greeting, #websiteUrl
 */ 
const markup = `
<h1 {{#main-header}}>Hello, {{personFullName}}</h1>
<p {{.excited-greeting}}>
    Thanks for joining our system!
</p>
<p>
    We look forward to seeing you on our website at {{websiteUrl}}
</p>
<p {{.excited-greeting}}>
    See you soon!
</p>
`;

/**
 * This is a key value representation of the style names vs rules
 * By convention, it looks very similar to an actual css style definition
 */ 
const styles = {
    '#main-header': `
        color: purple;
        font-weight: bold;
    `,
    '.excited-greeting': `
        width: 700px;
        border-color: 1px sold black;
    `
};

//a simple dictionary of values to insert
const values = {
    personFullName: "Brandon Dixon",
    websiteUrl: "www.bytethisstore.com"
};

//Now let's create the full body template
const emailTemplator = new EmailTemplator();
const generatedMarkup = emailTemplator.generateMarkup(markup, styles, values);
```

The response will look something like this:
```html
<h1  style="color: purple; font-weight: bold;" >Hello, Brandon Dixon</h1>
<p  style="width: 700px; border-color: 1px sold black;" width="700" >
    Thanks for joining our system!
</p>
<p>
    We look forward to seeing you on our website at www.bytethisstore.com
</p>
<p  style="width: 700px; border-color: 1px sold black;" width="700" >
    See you soon!
</p>
```

## Diving into the Details
In the javascript example above, I've created a styles object where the key/value pairs look very similar to how css is normally declared. I've also added "." and "#" in front of what would normally be a class vs an identifier. That is not enforced by the API, but I consider it to be a useful convention and recommend anyone who uses this library to follow that convention. The values are a simple key/value pair representing values which need to be interpolated.

The output contains all interpolations of values, plus styles wrapped in a "style=" tag. Width and height are also extracted into their own properties when they are represented in terms of "px".

## Notes on Styles
When using the style interpolation, any element which will have this style interpolation cannot have any additional "style" tags declared in the markup. It can have other class specifications / styles which are declared in a separate part of the html template. A single html element can only have one style interpolation for a similar reason.

## Note on Security
This library does not offer any HTML sanitation. If you are inserting any dynamic markup / data which has not been cleansed, be sure to pass the data through some library before passing it in here.
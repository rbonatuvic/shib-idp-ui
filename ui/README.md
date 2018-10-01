# Angular

Angular is a complete framework for UI development, meaning that in addition to rendering a web application in a browser, it also provides additional tools for other important UI considerations such as Internationalization (i18n), Accessibility (a11y), HTML 5 push state routing, an http library for connecting with our REST endpoints, a tool for scaffolding new services, components, pages, etc, and extensive end-to-end and unit testing toolset. In comparison to other frameworks, we rely on fewer 3rd party libraries or frameworks to handle these other concerns. The Angular community provides an extensive documentation website with full API documentation, as well as examples/tutorials. This includes a style-guide with rules for formatting code, which we follow on the SHIB-UI project.Angular is actively maintained by Google and has a large community and ecosystem.

## License

Angular is [licensed](https://angular.io/license) under the MIT license.

## Performance

Angular was designed for mobile from the ground up. Aside from limited processing power, mobile devices have other features and limitations that separate them from traditional computers. Touch interfaces, limited screen real estate, and mobile hardware have all been considered when developing the Angular framework. This has resulted in performance gains in Angular across the board, and makes it competitive with the many other UI frameworks available.

## Typescript

Angular uses [TypeScript](https://www.typescriptlang.org/), a superset of JavaScript that implements many new ESNext features as well as making JavaScript strongly typed. This makes errors and exceptions  more likely to happen during compilation, resulting in fewer defects.

By focusing on making the framework easier for computers to process, Angular and TypeScript allow for a much richer development process. Tooling for TypeScript and Angular allows for immediate Angular-specific help and feedback with nearly every IDE and editor. Strong typing enables developers to use more productive development tools and practices like static checking when developing JavaScript applications.

However, developers can still write vanilla JavaScript for Angular that runs without transpilation.

## NGRX

The popular Redux state management system is implemented in SHIB-UI via the framework [NgRx](http://ngrx.github.io/). This provides reliable uni-directional data-flow in the UI which organizes the UI state in a clear and predictable way. One of NgRx's most important features is its simple testability since it is based primarily on pure functions.

# JSON-Schema

For Providers and Filters, the forms in SHIB-UI are built based on the standard [JSON-Schema](http://json-schema.org/). This makes the generation of forms in the editors and wizards of the application dynamic, so that if new properties are added to the specification for a Metadata Provider type, it can be added to the JSON-schema of the application without ever having to re-deploy the javascript code. Rendering of the forms is handled using [ngx-schema-form](https://github.com/makinacorpus/ngx-schema-form), a component library for connecting to a JSON-Schema to render Angular form components, and provides extensibility through support of custom components and validation rules.

# Bootstrap

[Bootstrap](http://getbootstrap.com/) 4 is used for the css framework in SHIB-UI, and provides our base theme, a responsive grid system, consistent styling across all major browsers, and pre-styled components which are connected to Angular using ng-bootstrap, a 3rd party framework.

# Customizing UI

Within the `ui > src` folder, there are two files which can be used to customize the user interface quickly.

### Color Scheme
The `Brand.scss` contains the palette information used by bootstrap to color the user interface buttons and other components. Uncomment the color you wish to override and change the hex value accordingly and rebuild the user interface.

For example:

`// $blue: #00355f;`

change to...

`$blue: #0000FF;`

If you wish to change the __"primary"__ color or any other mapping according to Bootstrap's conventions, there is a block of mappings at the bottom of the `Brand.scss` file to accomodate this as well. Uncomment and change the value allocated to the corresponding aspect of the theme you wish to change.

The supported values are:

`$brand-primary: $blue;` - The primary color used throughout the site. Default: dark blue.

`$brand-secondary: $gray-700;` - An accept color used throughout the site. Default: dark gray.

`$brand-success: $green;` - Indicates success or some other positive action. Default: green.

`$brand-info: $light-blue;` - Indicates some sort of informative text or action for the user. Default: light blue.

`$brand-warning: $yellow;` - Indicates a warning to the user. Default: yellow.

`$brand-danger: $red;` - Indicates a dangerous action or error. Default: red.

`$brand-light: $light-grey;` - Color used for accents, text, etc throughout application. Default: light grey.

`$brand-dark: $dark-grey;` - Color used for accents, text, etc throughout application. Default: dark grey.

### Logos / Footer
The `Brand.ts` contains the links, text, and image paths to modify the logos, text, and links found within the header and footer. Override the values within this Typescript file and rebuild the user interface to view changes. If the local server should host these files, they should be added to the assets folder.

For example:

`export const brand = {};`

change to...

`export const brand = {
    header: 'Metadata Management'
};`


# Development

## Scaffolding

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

# Internationalization Guide

## About

The Shibboleth UI leverages Angular's built in internationalization (i18n)
system feature to allow for localization of the views.

<https://angular.io/guide/i18n>

Angular allows any piece of text in an HTML template to be included in the
translation source file.

## Conventions

### Choosing an identifier

To allow for easier identification of relevant strings the identifiers are
provided in the following format

```
type--kebab-case-text
```

For example

```html
<button>example text</button>
<!-- would become -->
<button i18n="@@action--example-text">example text</button>
```

Where `type` is one of the provided types listed in [the types section](#types)

`type` and `text` are separated by two dashes.

`text` is the text content, dash separated words, all lower case, with
punctuation removed.

### Types

The following types are provided:

* `action` buttons or links that cause a state change within the app
* `label` label for an input or a section
* `warning` messages that warn a user of exceptions in interactions, i.e.
  validation messages

### Localize Text Only

```html
<!-- BAD -->
<!-- this will pull both the text AND the icon into the translation -->
<button i18n="@@action--some-text">
  some text
  <i class="fa fa-icon"></i>
</span>

<!-- GOOD -->
<!-- this will only localize the text -->
<!-- NOTE: ng-container does not create any new dom on the page -->
<button>
  <ng-container i18n="@@action--some-text">some text</ng-container>
  <i class="fa fa-icon"></i>
</button>
```

### Updating Text

When updating text, update the identifier to match the new text field.

```html
<!-- BAD -->
<!-- identifier does not match text after update -->
<label i18n="@@label--name">Address</label>

<!-- GOOD -->
<!-- identifier and text match -->
<label i18n="@@label--address">Address</label>
```

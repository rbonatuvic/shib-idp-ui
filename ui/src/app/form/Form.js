import { withTheme } from "@rjsf/core";

import { widgets, fields } from "./component";

import { templates } from './component';

const {
    FieldTemplate,
    ObjectFieldTemplate,
    ArrayFieldTemplate,
    ErrorListTemplate,
} = templates;

export const ThemeObject = {
    widgets,
    fields,
    FieldTemplate,
    ObjectFieldTemplate,
    ArrayFieldTemplate,
    ErrorList: ErrorListTemplate,
};

export default withTheme(ThemeObject);
import TextWidget from './widgets/TextWidget';
import TextareaWidget from './widgets/TextareaWidget';
import SelectWidget from './widgets/SelectWidget';
import CheckboxWidget from './widgets/CheckboxWidget';
import AttributeReleaseWidget from './widgets/AttributeReleaseWidget';
import RadioWidget from './widgets/RadioWidget';
import OptionWidget from './widgets/OptionWidget';
import UpDownWidget from './widgets/UpDownWidget';

import FieldTemplate from './templates/FieldTemplate';
import ArrayFieldTemplate from './templates/ArrayFieldTemplate';
import ObjectFieldTemplate from './templates/ObjectFieldTemplate';

import TitleField from './fields/TitleField';
import DescriptionField from './fields/DescriptionField';
import FilterTargetField from './fields/FilterTargetField';

export const fields = {
    // SchemaField: CustomSchemaField
    TitleField,
    DescriptionField,
    FilterTargetField
};

export const templates = {
    FieldTemplate,
    ArrayFieldTemplate,
    ObjectFieldTemplate
}

export const widgets = {
    OptionWidget,
    TextWidget,
    TextareaWidget,
    SelectWidget,
    CheckboxWidget,
    RadioWidget,
    UpDownWidget,
    AttributeReleaseWidget
};
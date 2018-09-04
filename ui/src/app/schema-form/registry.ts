import { BooleanRadioComponent } from './widget/boolean-radio/boolean-radio.component';
import { FieldsetComponent } from './widget/fieldset/fieldset.component';
import { CustomStringComponent } from './widget/string/string.component';

import { WidgetRegistry, ObjectWidget } from 'ngx-schema-form';

import { ButtonWidget } from 'ngx-schema-form';
import { FileWidget } from 'ngx-schema-form';
import { RadioWidget } from 'ngx-schema-form';
import { RangeWidget } from 'ngx-schema-form';
import { CustomSelectComponent } from './widget/select/select.component';
import { DatalistComponent } from './widget/datalist/datalist.component';
import { CustomCheckboxComponent } from './widget/check/checkbox.component';
import { CustomTextAreaComponent } from './widget/textarea/textarea.component';
import { CustomArrayComponent } from './widget/array/array.component';
import { CustomIntegerComponent } from './widget/number/number.component';
import { FilterTargetComponent } from './widget/filter-target/filter-target.component';
import { ChecklistComponent } from './widget/check/checklist.component';
import { IconButtonComponent } from './widget/button/icon-button.component';


export class CustomWidgetRegistry extends WidgetRegistry {
    constructor() {
        super();

        /* Custom */
        this.register('string', CustomStringComponent);
        this.register('search', CustomStringComponent);
        this.register('tel', CustomStringComponent);
        this.register('url', CustomStringComponent);
        this.register('email', CustomStringComponent);
        this.register('password', CustomStringComponent);
        this.register('color', CustomStringComponent);
        this.register('date', CustomStringComponent);
        this.register('date-time', CustomStringComponent);
        this.register('time', CustomStringComponent);

        this.register('boolean-radio', BooleanRadioComponent);

        this.register('fieldset', FieldsetComponent);
        this.register('object', ObjectWidget);

        this.register('array', CustomArrayComponent);
        this.register('checklist', ChecklistComponent);

        this.register('select', CustomSelectComponent);
        this.register('boolean', CustomCheckboxComponent);
        this.register('checkbox', CustomCheckboxComponent);

        this.register('textarea', CustomTextAreaComponent);

        this.register('integer', CustomIntegerComponent);
        this.register('number', CustomIntegerComponent);

        this.register('datalist', DatalistComponent);

        this.register('filter-target', FilterTargetComponent);

        this.register('icon-button', IconButtonComponent);

        /* NGX-Form */
        this.register('range', RangeWidget);

        this.register('file', FileWidget);
        this.register('radio', RadioWidget);

        this.register('button', ButtonWidget);

        this.setDefaultWidget(CustomStringComponent);
    }
}

import { Component } from '@angular/core';

import { CheckboxWidget } from 'ngx-schema-form';

@Component({
    selector: 'checkbox-component',
    templateUrl: `./checkbox.component.html`
})
export class CustomCheckboxComponent extends CheckboxWidget { }

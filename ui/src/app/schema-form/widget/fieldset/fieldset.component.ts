import { Component } from '@angular/core';

import { ObjectWidget } from 'ngx-schema-form';

@Component({
    selector: 'fieldset-object',
    templateUrl: `./fieldset.component.html`,
    styleUrls: ['./fieldset.component.scss']
})
export class FieldsetComponent extends ObjectWidget { }

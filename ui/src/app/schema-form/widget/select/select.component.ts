import { Component } from '@angular/core';

import { ControlWidget } from 'ngx-schema-form';

@Component({
    selector: 'select-component',
    templateUrl: `./select.component.html`
})
export class CustomSelectComponent extends ControlWidget { }

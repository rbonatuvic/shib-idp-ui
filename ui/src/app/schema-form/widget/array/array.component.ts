import { Component } from '@angular/core';

import { ArrayWidget } from 'ngx-schema-form';

@Component({
    selector: 'array-component',
    templateUrl: `./array.component.html`
})
export class CustomArrayComponent extends ArrayWidget {}

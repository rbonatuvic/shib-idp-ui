import { Component } from '@angular/core';

import { ObjectWidget } from 'ngx-schema-form';
import { CustomArrayComponent } from './array.component';

/* tslint:disable */
@Component({
    selector: 'inline-obj-list',
    templateUrl: `./inline-obj-list.component.html`
})
export class InlineObjectListComponent extends CustomArrayComponent { }

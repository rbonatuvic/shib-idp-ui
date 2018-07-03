import { Component, OnChanges } from '@angular/core';

import { ControlWidget } from 'ngx-schema-form';
import { OneOf } from '../../model/one-of';

@Component({
    selector: 'datalist-component',
    templateUrl: `./datalist.component.html`
})
export class DatalistComponent extends ControlWidget {}

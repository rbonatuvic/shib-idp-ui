import { Component } from '@angular/core';
import { StringWidget } from 'ngx-schema-form';

@Component({
    selector: 'custom-string',
    templateUrl: `./string.component.html`,
    styleUrls: ['../widget.component.scss']
})
export class CustomStringComponent extends StringWidget {}

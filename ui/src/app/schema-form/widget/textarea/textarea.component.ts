import { Component } from '@angular/core';

import { TextAreaWidget } from 'ngx-schema-form';

@Component({
  selector: 'textarea-component',
  templateUrl: `./textarea.component.html`
})
export class CustomTextAreaComponent extends TextAreaWidget {}

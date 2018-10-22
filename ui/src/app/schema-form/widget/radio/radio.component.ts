import { Component } from '@angular/core';
import { RadioWidget } from 'ngx-schema-form';

@Component({
  selector: 'custom-radio-widget',
  templateUrl: `./radio.component.html`
})
export class CustomRadioComponent extends RadioWidget {}

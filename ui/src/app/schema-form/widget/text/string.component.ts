import { Component } from '@angular/core';
import { ControlWidget } from 'ngx-schema-form';

@Component({
    selector: 'custom-string',
    templateUrl: `./string.component.html`
})
export class CustomStringComponent extends ControlWidget {

    getInputType() {
        if (!this.schema.widget.id || this.schema.widget.id === 'string') {
            return 'text';
        } else {
            return this.schema.widget.id;
        }
    }
}

import {
    Component, AfterViewInit,
} from '@angular/core';
import { ButtonWidget } from 'ngx-schema-form';
import { ɵb as ActionRegistry } from 'ngx-schema-form';

@Component({
    selector: 'icon-button',
    templateUrl: `./icon-button.component.html`
})
export class IconButtonComponent extends ButtonWidget implements AfterViewInit {

    action = ($event) => {};

    constructor(private actionRegistry: ActionRegistry) {
        super();
    }

    ngAfterViewInit(): void {
        this.action = (e) => {
            let action = this.actionRegistry.get(this.button.id);
            if (this.button.id && action) {
                action(this.formProperty, this.button.parameters);
            }
            e.preventDefault();
        };
    }
}

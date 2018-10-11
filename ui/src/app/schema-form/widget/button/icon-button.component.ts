import {
    Component, AfterViewInit, ChangeDetectorRef
} from '@angular/core';
import { ButtonWidget } from 'ngx-schema-form';
import { ActionRegistry } from 'ngx-schema-form';
import { interval } from 'rxjs';

@Component({
    selector: 'icon-button',
    templateUrl: `./icon-button.component.html`
})
export class IconButtonComponent extends ButtonWidget implements AfterViewInit {

    visible = false;

    action = (e) => {};

    constructor(
        private actionRegistry: ActionRegistry,
        private changeDetector: ChangeDetectorRef
    ) {
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

        this.visible = !!this.actionRegistry.get(this.button.id);
        this.changeDetector.detectChanges();
    }
}

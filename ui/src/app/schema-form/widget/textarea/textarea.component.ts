import { Component, AfterViewInit, OnDestroy } from '@angular/core';

import { TextAreaWidget } from 'ngx-schema-form';
import { SchemaService } from '../../service/schema.service';
import { Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';

@Component({
  selector: 'textarea-component',
  templateUrl: `./textarea.component.html`
})
export class CustomTextAreaComponent extends TextAreaWidget implements AfterViewInit, OnDestroy {

    errorSub: Subscription;

    constructor(
        private widgetService: SchemaService
    ) {
        super();
    }

    ngAfterViewInit(): void {
        super.ngAfterViewInit();
        this.errorSub = this.control.valueChanges.pipe(startWith(this.control.value)).subscribe(v => {
            if (!v && this.required && !this.errorMessages.some(msg => !!msg.toLowerCase().match('required').length)) {
                this.errorMessages.push('message.required');
            }
        });
    }

    ngOnDestroy(): void {
        this.errorSub.unsubscribe();
    }

    get required(): boolean {
        return this.widgetService.isRequired(this.formProperty);
    }
}

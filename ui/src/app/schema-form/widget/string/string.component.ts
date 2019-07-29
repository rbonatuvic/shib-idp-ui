import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { StringWidget } from 'ngx-schema-form';
import { SchemaService } from '../../service/schema.service';
import { startWith } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { HARD_CODED_REQUIRED_MSG, REQUIRED_MSG_OVERRIDE } from '../../model/messages';

@Component({
    selector: 'custom-string',
    templateUrl: `./string.component.html`,
    styleUrls: ['../widget.component.scss']
})
export class CustomStringComponent extends StringWidget implements AfterViewInit, OnDestroy {

    errorSub: Subscription;

    constructor(
        private widgetService: SchemaService
    ) {
        super();
    }

    ngAfterViewInit(): void {
        super.ngAfterViewInit();
        let listener = this.formProperty.parent ? this.formProperty.parent : this.control;
        this.errorSub = listener.valueChanges.pipe(startWith(listener.value)).subscribe(v => {
            if (!this.control.value
                    && this.required
                    && !this.errorMessages.some(msg => HARD_CODED_REQUIRED_MSG.test(msg))
                    && this.errorMessages.indexOf(REQUIRED_MSG_OVERRIDE) < 0) {
                this.errorMessages.push(REQUIRED_MSG_OVERRIDE);
            }
            if (!this.required) {
                this.errorMessages = this.errorMessages.filter(e => e !== REQUIRED_MSG_OVERRIDE);
            }
        });
    }

    ngOnDestroy(): void {
        this.errorSub.unsubscribe();
    }

    get required(): boolean {
        const req = this.widgetService.isRequired(this.formProperty);

        return req;
    }

    getError(error: string): string {
        return HARD_CODED_REQUIRED_MSG.test(error) ? REQUIRED_MSG_OVERRIDE : error;
    }
}

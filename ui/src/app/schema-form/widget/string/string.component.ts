import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { StringWidget } from 'ngx-schema-form';
import { Validators } from '@angular/forms';
import { SchemaService } from '../../service/schema.service';
import { startWith } from 'rxjs/operators';
import { Subscription } from 'rxjs';

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
        this.errorSub = this.control.valueChanges.pipe(startWith(this.control.value)).subscribe(v => {
            if (!v && this.required && this.errorMessages.some(msg => !!msg.toLowerCase().match('required').length)) {
                this.errorMessages.push('message.required');
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
}

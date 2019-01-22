import { Component, AfterViewInit, OnDestroy } from '@angular/core';

import { SelectWidget } from 'ngx-schema-form';
import { SchemaService } from '../../service/schema.service';
import { map, shareReplay, startWith } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
    selector: 'select-component',
    templateUrl: `./select.component.html`
})
export class CustomSelectComponent extends SelectWidget implements AfterViewInit, OnDestroy {

    options$: any;

    errorSub: Subscription;

    constructor(
        private widgetService: SchemaService
    ) {
        super();
    }

    ngAfterViewInit(): void {
        super.ngAfterViewInit();
        if (this.schema.readOnly || this.schema.widget.disabled) {
            this.control.disable();
        } else {
            this.control.enable();
        }

        if (!(this.schema.widget instanceof String) && this.schema.widget.dataUrl) {
            this.options$ = this.widgetService
                .get(this.schema.widget.dataUrl)
                .pipe(
                    shareReplay(),
                    map(opts =>
                        opts.map(opt =>
                            ({ label: opt.replace('Resolver', 'Provider'), value: opt })
                        )
                    )
                );
        }

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

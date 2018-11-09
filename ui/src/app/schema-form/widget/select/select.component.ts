import { Component, AfterViewInit } from '@angular/core';

import { SelectWidget } from 'ngx-schema-form';
import { SchemaService } from '../../service/schema.service';
import { map } from 'rxjs/operators';

@Component({
    selector: 'select-component',
    templateUrl: `./select.component.html`
})
export class CustomSelectComponent extends SelectWidget implements AfterViewInit {

    options$: any;

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
                    map(opts =>
                        opts.map(opt =>
                            ({ label: opt.replace('Resolver', 'Provider'), value: opt })
                        )
                    )
                );
        }
    }

    get required(): boolean {
        return this.widgetService.isRequired(this.formProperty);
    }
}

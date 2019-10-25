import { Component, AfterViewInit } from '@angular/core';

import { ObjectWidget } from 'ngx-schema-form';
import { filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormError } from '../array/array.component';

/* tslint:disable */
@Component({
    selector: 'custom-object',
    templateUrl: `./object.component.html`
})
export class CustomObjectWidget extends ObjectWidget implements AfterViewInit {

    customErrors$: Observable<FormError[]>;

    constructor() {
        super();
    }

    ngAfterViewInit(): void {
        super.ngAfterViewInit();
        if (this.formProperty) {
            this.customErrors$ = this.formProperty.errorsChanges
                .pipe(
                    map(errors => errors ? errors : []),
                    map(errors => {
                        return errors.filter(err => err.path.replace('#', '') === (this.formProperty.path));
                    }),
                    map(errors => Object.values(errors.reduce((collection, error) => ({ ...collection, [error.code]: error }), {}))),
                    map(errors => errors.length ? errors : null)
                ) as Observable<FormError[]>;
        }
    }
}

import { Observable } from 'rxjs/Observable';
import { AbstractControl } from '@angular/forms';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

export function existsInCollection (ids$: Observable<string[]>) {
    return(control: AbstractControl) => {
        return ids$
            .map(ids => ids.find(id => id === control.value))
            .map(ids => ids && !!ids.length)
            .map((exists: boolean) => {
                return exists ? null : { exists: true };
            })
            .take(1);
    };
}

import { Injectable } from '@angular/core';
import {
    CanActivate,
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import * as fromWizard from '../reducer';

@Injectable()
export class StepExistsGuard implements CanActivate {
    constructor(
        private store: Store<fromWizard.State>,
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        this.store.select(fromWizard.getWizardDefinition).pipe(
            map(current => !!current)
        ).subscribe(defined => console.log(defined));
        return of(true);
    }
}

// !isDefined ? this.router.navigate(['metadata/provider/wizard/new']) : isDefined

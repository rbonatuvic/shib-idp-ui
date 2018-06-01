import { Injectable } from '@angular/core';
import {
    CanActivate,
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import * as fromProvider from '../reducer';

@Injectable()
export class CopyIsSetGuard implements CanActivate {
    constructor(
        private store: Store<fromProvider.State>,
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.store.select(fromProvider.getCopy).pipe(
            map(copy => !!copy),
            tap(isDefined => !isDefined ? this.router.navigate(['/new/copy']) : isDefined)
        );
    }
}

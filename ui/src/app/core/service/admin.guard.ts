import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromCore from '../reducer';
import { Observable } from 'rxjs';
import { filter, catchError, take } from 'rxjs/operators';


@Injectable({
    providedIn: 'root',
})
export class AdminGuard implements CanActivate {

    constructor(
        private store: Store<fromCore.CoreState>,
        private router: Router
    ) {}

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        const isAdminObs = this.checkIsAdmin().pipe(take(1));
        isAdminObs.subscribe(authed => {
            if (!authed) {
                this.router.navigate(['/']);
            }
        });
        return isAdminObs;
    }

    checkIsAdmin(): Observable<boolean> {
        return this.store
            .select(fromCore.isCurrentUserAdmin)
            .pipe(
                filter(isAdmin => isAdmin !== null),
            );
    }
}

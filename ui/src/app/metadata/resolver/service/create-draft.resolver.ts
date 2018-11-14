import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { MetadataResolver } from '../../domain/model';
import { AddDraftRequest } from '../action/draft.action';
import * as fromResolver from '../reducer';

@Injectable()
export class CreateDraftResolverService {
    constructor(
        private store: Store<fromResolver.State>
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string> | Observable<never> {
        let id = route.paramMap.get('id');
        let resolver = <MetadataResolver>{
            id: `r-${Date.now()}`
        };
        if (!id) {
            id = resolver.id;
            this.store.dispatch(new AddDraftRequest(resolver));
        }
        return of(id);
    }
}

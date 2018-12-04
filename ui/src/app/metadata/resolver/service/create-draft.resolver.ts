import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { MetadataResolver } from '../../domain/model';
import { AddDraftRequest } from '../action/draft.action';
import * as fromResolver from '../reducer';
import { EntityDraftService } from '../../domain/service/draft.service';

@Injectable()
export class CreateDraftResolverService {
    constructor(
        private store: Store<fromResolver.State>,
        private draftService: EntityDraftService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string> | Observable<never> {
        let id = route.queryParamMap.get('id');
        if (id) {
            let exists = this.draftService.exists(id);
            if (!exists) {
                let resolver = <MetadataResolver>{id};
                this.store.dispatch(new AddDraftRequest(resolver));
            }
        }
        if (!id) {
            let resolver = <MetadataResolver>{
                id: `r-${Date.now()}`
            };
            id = resolver.id;
            this.store.dispatch(new AddDraftRequest(resolver));
        }
        return of(id);
    }
}

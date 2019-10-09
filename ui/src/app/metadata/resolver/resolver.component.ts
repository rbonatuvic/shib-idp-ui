import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { LoadResolverRequest } from './action/collection.action';
import * as fromRoot from '../../app.reducer';
import * as fromResolver from './reducer';

@Component({
    selector: 'metadata-resolver-page',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `<ng-container *ngIf="!(loading$ | async)">
        <router-outlet></router-outlet>
    <ng-container>`,
    styleUrls: []
})
export class MetadataResolverPageComponent {

    loading$: Observable<boolean> = this.store.select(fromResolver.getResolversLoading);

    constructor(
        private store: Store<fromRoot.State>
    ) {
        this.store.dispatch(new LoadResolverRequest());
    }
}

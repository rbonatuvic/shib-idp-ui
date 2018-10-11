import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, withLatestFrom, distinctUntilChanged } from 'rxjs/operators';
import { SelectDraft } from '../action/draft.action';
import { Store } from '@ngrx/store';
import * as fromCollection from '../reducer';

@Component({
    selector: 'new-resolver-page',
    templateUrl: './new-resolver.component.html',
    styleUrls: ['./new-resolver.component.scss']
})
export class NewResolverComponent {

    actionsSubscription: Subscription;

    canSetNewType$: Observable<boolean>;

    constructor(
        private route: ActivatedRoute,
        private store: Store<fromCollection.State>
    ) {
        this.canSetNewType$ = this.route.queryParams.pipe(
            withLatestFrom(this.route.url),
            map(([params, url]) => this.route.snapshot.firstChild.routeConfig.path !== 'blank' || params.index === 'common')
        );

        this.actionsSubscription = this.route.queryParams.pipe(
            distinctUntilChanged(),
            map(params => new SelectDraft(params.entityId))
        ).subscribe(store);
    }
}

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, startWith, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { SelectDraftRequest } from '../action/draft.action';
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
        private router: Router,
        private store: Store<fromCollection.State>
    ) {
        this.canSetNewType$ = this.router.events.pipe(
            startWith(this.route),
            debounceTime(10),
            map(url => {
                let child = this.route.snapshot.firstChild;
                return child.routeConfig.path.match('blank').length === 0 || child.params.index === 'common';
            })
        );

        this.actionsSubscription = this.route.queryParams.pipe(
            distinctUntilChanged(),
            map(params => new SelectDraftRequest(params.id))
        ).subscribe(this.store);
    }
}

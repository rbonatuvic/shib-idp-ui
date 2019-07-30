import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, Subject } from 'rxjs';
import { map, startWith, distinctUntilChanged, debounceTime, withLatestFrom, takeUntil } from 'rxjs/operators';
import { SelectDraftRequest } from '../action/draft.action';
import { Store } from '@ngrx/store';
import * as fromCollection from '../reducer';

@Component({
    selector: 'new-resolver-page',
    templateUrl: './new-resolver.component.html',
    styleUrls: ['./new-resolver.component.scss']
})
export class NewResolverComponent implements OnDestroy {

    private ngUnsubscribe: Subject<void> = new Subject<void>();

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
                return !child.routeConfig.path.match('blank') || child.params.index === 'common';
            })
        );

        this.actionsSubscription = this.route.queryParams.pipe(
            takeUntil(this.ngUnsubscribe),
            distinctUntilChanged(),
            map(data => new SelectDraftRequest(data.id))
        ).subscribe(this.store);
    }
    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}

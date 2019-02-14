import { Component, OnDestroy, Inject } from '@angular/core';
import { Subscription, Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';

import { ActivatedRoute } from '@angular/router';
import { map, distinctUntilChanged, skipWhile, takeUntil } from 'rxjs/operators';
import { SelectResolver } from '../action/collection.action';
import * as fromResolvers from '../reducer';
import { MetadataResolver } from '../../domain/model';
import { SetDefinition, ClearWizard } from '../../../wizard/action/wizard.action';
import { Clear } from '../action/entity.action';
import { METADATA_SOURCE_EDITOR } from '../wizard-definition';
import { Wizard } from '../../../wizard/model';

@Component({
    selector: 'resolver-select',
    templateUrl: './resolver-select.component.html',
    styleUrls: []
})

export class ResolverSelectComponent implements OnDestroy {
    private ngUnsubscribe: Subject<void> = new Subject<void>();
    actionsSubscription: Subscription;

    resolver$: Observable<MetadataResolver>;

    constructor(
        private store: Store<fromResolvers.State>,
        private route: ActivatedRoute,
        @Inject(METADATA_SOURCE_EDITOR) private sourceWizard: Wizard<MetadataResolver>
    ) {
        this.route.params.pipe(
            takeUntil(this.ngUnsubscribe),
            map(params => new SelectResolver(params.id))
        ).subscribe(store);

        this.resolver$ = this.store.select(fromResolvers.getSelectedResolver).pipe(skipWhile(p => !p));

        this.resolver$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(resolver => this.setDefinition(resolver));
    }

    setDefinition(resolver: MetadataResolver): void {
        if (resolver) {
            this.store.dispatch(new SetDefinition(this.sourceWizard));
        }
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        this.store.dispatch(new Clear());
        this.store.dispatch(new ClearWizard());
    }
}


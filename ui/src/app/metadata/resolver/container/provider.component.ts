import { Component, Output, Input, EventEmitter, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';

import { MetadataResolver } from '../../domain/model/metadata-provider';
import { SelectProvider } from '../../domain/action/provider-collection.action';
import * as fromProviders from '../../domain/reducer';

@Component({
    selector: 'provider-page',
    templateUrl: './provider.component.html',
    styleUrls: ['./provider.component.scss'],
    providers: [NgbPopoverConfig]
})
export class ProviderComponent implements OnDestroy {
    actionsSubscription: Subscription;

    constructor(
        store: Store<fromProviders.State>,
        route: ActivatedRoute
    ) {
        this.actionsSubscription = route.params.pipe(
            distinctUntilChanged(),
            map(params => new SelectProvider(params.id))
        ).subscribe(store);
    }

    ngOnDestroy() {
        this.actionsSubscription.unsubscribe();
    }
} /* istanbul ignore next */

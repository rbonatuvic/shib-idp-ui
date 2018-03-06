import { Component, Output, Input, EventEmitter, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';

import { MetadataProvider } from '../../metadata-provider/model/metadata-provider';
import { SelectProvider } from '../../metadata-provider/action/provider.action';
import * as fromProviders from '../../metadata-provider/reducer';
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
        this.actionsSubscription = route.params
            .distinctUntilChanged()
            .map(params => new SelectProvider(params.id))
            .subscribe(store);
    }

    ngOnDestroy() {
        this.actionsSubscription.unsubscribe();
    }
} /* istanbul ignore next */

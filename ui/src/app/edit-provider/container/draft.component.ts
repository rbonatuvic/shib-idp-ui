import { Component, Output, Input, EventEmitter, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';

import { MetadataProvider } from '../../domain/model/metadata-provider';
import { SelectDraft } from '../../domain/action/draft-collection.action';
import * as fromCollection from '../../domain/reducer';
@Component({
    selector: 'provider-page',
    templateUrl: './provider.component.html',
    styleUrls: ['./provider.component.scss'],
    providers: [NgbPopoverConfig]
})
export class DraftComponent implements OnDestroy {
    actionsSubscription: Subscription;

    constructor(
        store: Store<fromCollection.CollectionState>,
        route: ActivatedRoute
    ) {
        this.actionsSubscription = route.params
            .distinctUntilChanged()
            .map(params => new SelectDraft(params.entityId))
            .subscribe(store);
    }

    ngOnDestroy() {
        this.actionsSubscription.unsubscribe();
    }
} /* istanbul ignore next */

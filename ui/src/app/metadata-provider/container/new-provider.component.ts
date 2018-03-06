import {
    Component,
    OnChanges,
    OnInit,
    OnDestroy,
    ElementRef,
    ViewChildren
} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormControlName, Validators, AbstractControl } from '@angular/forms';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/take';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';

import { MetadataProvider } from '../model/metadata-provider';
import { EntityDescriptor } from '../model/entity-descriptor';
import { AddDraftRequest } from '../action/draft.action';
import { AddProviderRequest, UploadProviderRequest, CreateProviderFromUrlRequest } from '../action/provider.action';
import * as fromProviders from '../reducer';
import { EntityValidators } from '../service/entity-validators.service';

@Component({
    selector: 'new-provider-page',
    templateUrl: './new-provider.component.html'
})
export class NewProviderComponent implements OnInit {
    private ngUnsubscribe: Subject<void> = new Subject<void>();

    readonly UPLOAD = Symbol('UPLOAD_FORM');
    readonly BLANK = Symbol('BLANK_FORM');

    type: Symbol = this.BLANK;

    constructor(
        private store: Store<fromProviders.ProviderState>
    ) { }

    ngOnInit(): void {
        this.toggle(this.type);
    }

    toggle(type: Symbol): void {
        this.type = type;
    }

    upload(uploadFile: { name: string, body: string }): void {
        this.store.dispatch(new UploadProviderRequest(uploadFile));
    }

    createFromUrl(data: { name: string, url: string }): void {
        this.store.dispatch(new CreateProviderFromUrlRequest(data));
    }

    next(provider: { entityId: string, serviceProviderName: string }): void {
        const val: MetadataProvider = new EntityDescriptor(provider);
        this.store.dispatch(new AddDraftRequest(val));
    }
} /* istanbul ignore next */

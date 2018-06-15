import {
    Component,
    OnInit,
    Output,
    EventEmitter
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { AddDraftRequest } from '../action/draft.action';
import * as fromResolver from '../reducer';
import { EntityValidators } from '../../domain/service/entity-validators.service';
import { FileBackedHttpMetadataResolver } from '../../domain/entity/resolver/file-backed-http-metadata-resolver';

@Component({
    selector: 'blank-resolver-form',
    templateUrl: './blank-resolver.component.html'
})
export class BlankResolverComponent implements OnInit {
    @Output() save: EventEmitter<any> = new EventEmitter();

    providerForm: FormGroup;
    ids$: Observable<string[]>;

    constructor(
        private store: Store<fromResolver.ResolverState>,
        private fb: FormBuilder
    ) {
        this.ids$ = this.store.select(fromResolver.getAllEntityIds);
    }

    ngOnInit(): void {
        this.providerForm = this.fb.group({
            serviceProviderName: ['', Validators.required],
            entityId: ['', Validators.required, EntityValidators.createUniqueIdValidator(this.ids$)]
        });
    }

    next(): void {
        const val = new FileBackedHttpMetadataResolver({
            entityId: this.providerForm.get('entityId').value,
            serviceProviderName: this.providerForm.get('serviceProviderName').value
        });
        this.store.dispatch(new AddDraftRequest(val));
    }
}

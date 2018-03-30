import { Component, Output, Input, EventEmitter, OnInit, OnChanges, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { ProviderFormFragmentComponent } from './provider-form-fragment.component';
import { ProviderStatusEmitter, ProviderValueEmitter } from '../../../domain/service/provider-change-emitter.service';
import { MetadataProvider, Organization, Contact } from '../../../domain/model/metadata-provider';
import { ListValuesService } from '../../../domain/service/list-values.service';

@Component({
    selector: 'finish-form',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './finish-form.component.html',
    styleUrls: ['./finish-form.component.scss']
})
export class FinishFormComponent extends ProviderFormFragmentComponent implements OnInit, OnChanges, OnDestroy {
    @Input() provider: MetadataProvider;

    form: FormGroup;
    attributesToRelease$: Observable<any[]>;

    constructor(
        protected fb: FormBuilder,
        protected statusEmitter: ProviderStatusEmitter,
        protected valueEmitter: ProviderValueEmitter,
        private listValues: ListValuesService
    ) {
        super(fb, statusEmitter, valueEmitter);
        this.attributesToRelease$ = listValues.attributesToRelease;
    }

    createForm(): void {
        this.form = this.fb.group({
            serviceEnabled: [true]
        });
    }

    ngOnChanges(): void {
        this.form.reset({
            serviceEnabled: !this.provider ? false : this.provider.serviceEnabled !== false ? true : false
        });
    }
} /* istanbul ignore next */

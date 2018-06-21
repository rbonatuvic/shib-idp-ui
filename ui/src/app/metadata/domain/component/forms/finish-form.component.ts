import { Component, Input, OnInit, OnChanges, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { ProviderFormFragmentComponent } from './provider-form-fragment.component';
import { ProviderStatusEmitter, ProviderValueEmitter } from '../../../domain/service/provider-change-emitter.service';
import { MetadataResolver } from '../../../domain/model';
import { ListValuesService } from '../../../domain/service/list-values.service';

@Component({
    selector: 'finish-form',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './finish-form.component.html',
    styleUrls: ['./finish-form.component.scss']
})
export class FinishFormComponent extends ProviderFormFragmentComponent implements OnInit, OnChanges, OnDestroy {
    @Input() resolver: MetadataResolver;

    form: FormGroup;
    attributesToRelease$: Observable<any[]>;

    constructor(
        protected fb: FormBuilder,
        protected statusEmitter: ProviderStatusEmitter,
        protected valueEmitter: ProviderValueEmitter,
        private listValues: ListValuesService
    ) {
        super(fb, statusEmitter, valueEmitter);
        this.attributesToRelease$ = this.listValues.attributesToRelease;
    }

    createForm(): void {
        this.form = this.fb.group({
            serviceEnabled: [true]
        });
    }

    ngOnChanges(): void {
        this.form.reset({
            serviceEnabled: !this.resolver ? false : this.resolver.serviceEnabled !== false ? true : false
        });
    }
}

import { Component, Output, Input, EventEmitter, OnInit, OnChanges, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { ProviderFormFragmentComponent } from './provider-form-fragment.component';
import { ProviderStatusEmitter, ProviderValueEmitter } from '../../../domain/service/provider-change-emitter.service';
import { MetadataProvider, Organization, Contact } from '../../../domain/model/metadata-provider';
import * as patterns from '../../../shared/regex';

@Component({
    selector: 'metadata-ui-form',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './metadata-ui-form.component.html'
})
export class MetadataUiFormComponent extends ProviderFormFragmentComponent implements OnInit, OnChanges, OnDestroy {
    @Input() provider: MetadataProvider;

    descriptionMaxLength = this.defaultMaxLength;

    constructor(
        protected fb: FormBuilder,
        protected statusEmitter: ProviderStatusEmitter,
        protected valueEmitter: ProviderValueEmitter
    ) {
        super(fb, statusEmitter, valueEmitter);
    }

    createForm(): void {
        this.form = this.fb.group({
            mdui: this.fb.group({
                displayName: '',
                informationUrl: [''],
                privacyStatementUrl: [''],
                description: '',
                logoUrl: [''],
                logoHeight: [0, [Validators.min(0), Validators.pattern(patterns.INTEGER_REGEX)]],
                logoWidth: [0, [Validators.min(0), Validators.pattern(patterns.INTEGER_REGEX)]]
            })
        });
    }

    ngOnChanges(): void {
        this.form.reset({
            mdui: this.provider.mdui || {}
        });
    }
} /* istanbul ignore next */

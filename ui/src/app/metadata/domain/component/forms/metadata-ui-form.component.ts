import { Component, Input, OnInit, OnChanges, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ProviderFormFragmentComponent } from './provider-form-fragment.component';
import { ProviderStatusEmitter, ProviderValueEmitter } from '../../../domain/service/provider-change-emitter.service';
import { MetadataResolver } from '../../../domain/model';
import * as patterns from '../../../../shared/regex';

@Component({
    selector: 'metadata-ui-form',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './metadata-ui-form.component.html'
})
export class MetadataUiFormComponent extends ProviderFormFragmentComponent implements OnInit, OnChanges, OnDestroy {
    @Input() resolver: MetadataResolver;

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
            mdui: this.resolver.mdui || {}
        });
    }
} /* istanbul ignore next */

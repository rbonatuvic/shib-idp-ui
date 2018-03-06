import { Component, Output, Input, EventEmitter, OnInit, OnChanges, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { ProviderFormFragmentComponent } from './provider-form-fragment.component';
import { ProviderStatusEmitter, ProviderValueEmitter } from '../../service/provider-change-emitter.service';
import { MetadataProvider, Organization, Contact } from '../../model/metadata-provider';
import { ListValuesService } from '../../service/list-values.service';
import { FormArray } from '@angular/forms/src/model';

@Component({
    selector: 'attribute-release-form',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './attribute-release-form.component.html'
})
export class AttributeReleaseFormComponent extends ProviderFormFragmentComponent implements OnInit, OnChanges, OnDestroy {
    @Input() provider: MetadataProvider;

    form: FormGroup;
    attributesToRelease: any[];
    listOfAttributes$: Observable<{ key: string, label: string }[]>;

    constructor(
        protected fb: FormBuilder,
        protected statusEmitter: ProviderStatusEmitter,
        protected valueEmitter: ProviderValueEmitter,
        protected listService: ListValuesService
    ) {
        super(fb, statusEmitter, valueEmitter);
    }

    createForm(): void {
        this.form = this.fb.group({
            attributeRelease: this.fb.array([])
        });
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.listOfAttributes$ = this.listService.attributesToRelease;
    }

    ngOnChanges(): void {
        this.provider.attributeRelease = this.provider.attributeRelease || [];
        this.setAttributes(this.provider.attributeRelease);
    }

    get attributeRelease(): FormArray {
        return this.form.get('attributeRelease') as FormArray;
    }

    isChecked(attr): boolean {
        return this.provider.attributeRelease.indexOf(attr) > -1;
    }

    setAttributes(list: string[] = []): void {
        let attrs = list.map(attr => this.fb.control(attr));
        const fbarray = this.fb.array(attrs);
        this.form.setControl('attributeRelease', fbarray);
    }

    onCheck($event, attr: string): void {
        const checked = $event.target.checked;
        if (checked) {
            this.attributeRelease.push(this.fb.control(attr));
        } else {
            const index = this.attributeRelease.controls.findIndex(control => control.value === attr);
            this.attributeRelease.removeAt(index);
        }
        this.attributeRelease.updateValueAndValidity();
    }
} /* istanbul ignore next */

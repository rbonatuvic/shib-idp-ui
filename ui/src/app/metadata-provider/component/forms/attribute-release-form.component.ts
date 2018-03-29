import { Component, Output, Input, EventEmitter, OnInit, OnChanges, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/last';

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
        return this.attributeRelease.controls.findIndex(control => control.value === attr) > -1;
    }

    setAttributes(list: string[] = []): void {
        let attrs = list.map(attr => this.fb.control(attr));
        const fbarray = this.fb.array(attrs);
        this.form.setControl('attributeRelease', fbarray);
    }

    onCheck($event, attr: string): void {
        const checked = $event ? $event.target.checked : true;
        if (checked) {
            this.attributeRelease.push(this.fb.control(attr));
        } else {
            const index = this.attributeRelease.controls.findIndex(control => control.value === attr);
            this.attributeRelease.removeAt(index);
        }
    }

    onCheckAll(): void {
        this.onCheckNone();
        this.listOfAttributes$.last().subscribe(attrs => {
            attrs.forEach(attr => this.onCheck(null, attr.key));
        });
    }
    onCheckNone(event: Event | null = null): void {
        if (event) {
            event.preventDefault();
        }
        while (this.attributeRelease.controls.length !== 0) {
            this.attributeRelease.removeAt(0);
        }
    }
} /* istanbul ignore next */

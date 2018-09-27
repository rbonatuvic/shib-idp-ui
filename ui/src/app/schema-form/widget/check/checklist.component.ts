import { Component, AfterViewInit, OnDestroy } from '@angular/core';

import { ArrayWidget } from 'ngx-schema-form';
import { AttributesService } from '../../../metadata/domain/service/attributes.service';
import { Observable, of, Subscription } from 'rxjs';

/* istanbul ignore next */
@Component({
    selector: 'checklist-component',
    templateUrl: `./checklist.component.html`
})
export class ChecklistComponent extends ArrayWidget implements AfterViewInit, OnDestroy {
    checked: any = {};
    currentData: { key: string, label: string }[];
    sub: Subscription;

    constructor(
        private attributes: AttributesService
    ) {
        super();
    }

    ngAfterViewInit(): void {
        super.ngAfterViewInit();
        this.formProperty.value.forEach(val => this.checked[val] = true);

        this.sub = this.data.subscribe(d => this.currentData = d);
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    private commitValue(): void {
        this.formProperty.setValue(Object.keys(this.checked), false);
    }

    get data(): Observable<{ key: string, label: string }[]> {
        return this.schema.widget.data ? of(this.schema.widget.data) : this.attributes.query(this.schema.widget.dataUrl);
    }

    onCheck(value) {
        if (!this.checked[value]) {
            this.checked[value] = true;
        } else {
            delete this.checked[value];
        }
        this.commitValue();
    }

    onCheckAll(): void {
        this.currentData.forEach(attr => this.checked[attr.key] = true);
        this.commitValue();
    }
    onCheckNone(event: Event | null = null): void {
        this.currentData.forEach(attr => {
            delete this.checked[attr.key];
        });
        this.commitValue();
    }
}

import { Component, AfterViewInit } from '@angular/core';

import { ArrayWidget } from 'ngx-schema-form';

/* istanbul ignore next */
@Component({
    selector: 'checklist-component',
    templateUrl: `./checklist.component.html`
})
export class ChecklistComponent extends ArrayWidget implements AfterViewInit {
    checked: any = {};

    ngAfterViewInit(): void {
        super.ngAfterViewInit();
        this.formProperty.value.forEach(val => this.checked[val] = true);
    }

    private commitValue(): void {
        this.formProperty.setValue(Object.keys(this.checked), false);
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
        this.schema.widget.data.forEach(attr => this.checked[attr.key] = true);
        this.commitValue();
    }
    onCheckNone(event: Event | null = null): void {
        this.schema.widget.data.forEach(attr => {
            delete this.checked[attr.key];
        });
        this.commitValue();
    }
}

import { Component, AfterViewInit } from '@angular/core';

import { ControlWidget } from 'ngx-schema-form';
import { SchemaService } from '../../service/schema.service';
import { HARD_CODED_REQUIRED_MSG } from '../../model/messages';

@Component({
    selector: 'datalist-component',
    templateUrl: `./datalist.component.html`
})
export class DatalistComponent extends ControlWidget implements AfterViewInit {

    data: string[] = [];

    constructor(
        private widgetService: SchemaService
    ) {
        super();
    }

    ngAfterViewInit(): void {
        super.ngAfterViewInit();
        if (this.schema.readOnly) {
            this.control.disable();
        } else {
            this.control.enable();
        }
    }

    getData(query: string): void {
        this.data = [...this.schema.widget.data];
    }

    get required(): boolean {
        return this.widgetService.isRequired(this.formProperty);
    }

    get title(): string {
        return this.schema.title || this.formProperty.parent.schema.title;
    }

    getError(error: string): string {
        return HARD_CODED_REQUIRED_MSG.test(error) ? 'message.required' : error;
    }

    get showHint(): boolean {
        return (this.control.touched ? !this.showError : true) && this.schema.widget.help;
    }

    get showError(): boolean {
        return !!this.errorMessages && this.errorMessages.length > 0;
    }
}

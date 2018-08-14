import { NgModule } from '@angular/core';
import { SchemaFormModule } from 'ngx-schema-form';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { BooleanRadioComponent } from './widget/boolean-radio/boolean-radio.component';
import { SchemaService } from './service/schema.service';
import { FieldsetComponent } from './widget/fieldset/fieldset.component';
import { CustomStringComponent } from './widget/string/string.component';
import { NgbPopoverModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { CustomSelectComponent } from './widget/select/select.component';
import { DatalistComponent } from './widget/datalist/datalist.component';
import { CustomCheckboxComponent } from './widget/check/checkbox.component';
import { CustomTextAreaComponent } from './widget/textarea/textarea.component';
import { CustomArrayComponent } from './widget/array/array.component';
import { CustomIntegerComponent } from './widget/number/number.component';
import { FilterTargetComponent } from './widget/filter-target/filter-target.component';
import { ChecklistComponent } from './widget/check/checklist.component';

export const COMPONENTS = [
    BooleanRadioComponent,
    FieldsetComponent,
    CustomStringComponent,
    CustomSelectComponent,
    DatalistComponent,
    CustomCheckboxComponent,
    CustomTextAreaComponent,
    CustomArrayComponent,
    CustomIntegerComponent,
    FilterTargetComponent,
    ChecklistComponent
];

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgbPopoverModule,
        NgbDropdownModule,
        SharedModule,
        SchemaFormModule.forRoot()
    ],
    declarations: COMPONENTS,
    entryComponents: COMPONENTS,
    exports: [
        ...COMPONENTS,
        SchemaFormModule,
        SharedModule
    ],
})
export class FormModule {
    static forRoot() {
        return {
            ngModule: RootFormModule,
            providers: [
                SchemaService
            ]
        };
    }
}

@NgModule({
    imports: [],
})
export class RootFormModule { }

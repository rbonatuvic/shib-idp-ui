import { CommonModule } from '@angular/common';
import { Component, Output, Input, NgModule } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Wizard } from '../app/wizard/model';
import { MetadataProvider, MetadataResolver } from '../app/metadata/domain/model';

/*tslint:disable:component-selector */
@Component({
    selector: 'wizard',
    template: '<ng-content></ng-content>'
})
export class MockWizardComponent {
    @Output() onNext = new EventEmitter();
    @Output() onPrevious = new EventEmitter();
    @Output() onLast = new EventEmitter();
    @Output() onSave = new EventEmitter();
}

/*tslint:disable:component-selector */
@Component({
    selector: 'wizard-summary',
    template: '<ng-content></ng-content>'
})
export class MockWizardSummaryComponent {
    @Input() summary: { definition: Wizard<MetadataProvider | MetadataResolver>, schema: { [id: string]: any }, model: any };
    @Output() onPageSelect: EventEmitter<string> = new EventEmitter();
}

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        MockWizardComponent,
        MockWizardSummaryComponent
    ],
    exports: [
        MockWizardComponent,
        MockWizardSummaryComponent
    ],
    providers: []
})
export class MockWizardModule { }

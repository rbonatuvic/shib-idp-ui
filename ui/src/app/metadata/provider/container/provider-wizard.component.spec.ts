import { Component, ViewChild } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, Store, combineReducers } from '@ngrx/store';

import { NgbDropdownModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import { ProviderWizardComponent } from './provider-wizard.component';
import * as fromRoot from '../reducer';
import { WizardModule } from '../../../wizard/wizard.module';
import { WizardSummaryComponent } from '../../domain/component/wizard-summary.component';
import { SummaryPropertyComponent } from '../../domain/component/summary-property.component';
import * as fromWizard from '../../../wizard/reducer';
import { MockI18nModule } from '../../../../testing/i18n.stub';

@Component({
    template: `
        <provider-wizard></provider-wizard>
    `
})
class TestHostComponent {
    @ViewChild(ProviderWizardComponent)
    public componentUnderTest: ProviderWizardComponent;
}

describe('Provider Wizard Component', () => {

    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let app: ProviderWizardComponent;
    let store: Store<fromRoot.State>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                WizardModule,
                NgbDropdownModule,
                NgbPopoverModule,
                RouterTestingModule,
                StoreModule.forRoot({
                    provider: combineReducers(fromRoot.reducers),
                    wizard: combineReducers(fromWizard.reducers)
                }),
                MockI18nModule
            ],
            declarations: [
                ProviderWizardComponent,
                SummaryPropertyComponent,
                WizardSummaryComponent,
                TestHostComponent
            ]
        }).compileComponents();

        store = TestBed.get(Store);
        spyOn(store, 'dispatch');

        fixture = TestBed.createComponent(TestHostComponent);
        instance = fixture.componentInstance;
        app = instance.componentUnderTest;
        fixture.detectChanges();
    }));

    it('should instantiate the component', async(() => {
        expect(app).toBeTruthy();
    }));
});

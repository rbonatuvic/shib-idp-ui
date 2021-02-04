import { Component, ViewChild } from '@angular/core';
import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, Store, combineReducers } from '@ngrx/store';

import * as fromWizard from '../reducer';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { WizardComponent } from './wizard.component';
import { WizardService } from '../service/wizard.service';
import { MockI18nModule } from '../../../testing/i18n.stub';

@Component({
    template: `
        <wizard></wizard>
    `
})
class TestHostComponent {
    @ViewChild(WizardComponent, {static: true})
    public componentUnderTest: WizardComponent;
}

describe('Wizard Component', () => {

    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let app: WizardComponent;
    let store: Store<fromWizard.State>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                NgbDropdownModule,
                RouterTestingModule,
                StoreModule.forRoot({
                    wizard: combineReducers(fromWizard.reducers)
                }),
                MockI18nModule
            ],
            declarations: [
                WizardComponent,
                TestHostComponent
            ],
            providers: [
                WizardService
            ]
        }).compileComponents();

        store = TestBed.get(Store);
        spyOn(store, 'dispatch');

        fixture = TestBed.createComponent(TestHostComponent);
        instance = fixture.componentInstance;
        app = instance.componentUnderTest;
        fixture.detectChanges();
    }));

    it('should compile without error', () => {
        expect(app).toBeTruthy();
    });
});

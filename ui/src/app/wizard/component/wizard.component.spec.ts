import { Component, ViewChild } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, Store, combineReducers } from '@ngrx/store';

import * as fromWizard from '../reducer';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { WizardComponent, ICONS } from './wizard.component';
import { MockI18nModule } from '../../../testing/i18n.stub';

@Component({
    template: `
        <wizard></wizard>
    `
})
class TestHostComponent {
    @ViewChild(WizardComponent)
    public componentUnderTest: WizardComponent;
}

describe('Wizard Component', () => {

    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let app: WizardComponent;
    let store: Store<fromWizard.State>;

    beforeEach(async(() => {
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

    describe('getIcon method', () => {
        it('should return the check string for the last index', () => {
            expect(app.getIcon({ index: 'foo' }, { index: 'foo' })).toEqual(ICONS.CHECK);
        });
        it('should return the index icon for other indexes', () => {
            expect(app.getIcon({ index: 'foo' }, { index: 'bar' })).toEqual(ICONS.INDEX);
            expect(app.getIcon({ index: 'foo' }, null)).toEqual(ICONS.INDEX);
        });
    });
});

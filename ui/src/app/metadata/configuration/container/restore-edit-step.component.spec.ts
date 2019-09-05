import { Component, ViewChild, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, combineReducers, Store } from '@ngrx/store';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { RestoreEditStepComponent } from './restore-edit-step.component';
import * as fromConfiguration from '../reducer';
import * as fromProviders from '../../provider/reducer';
import * as fromResolvers from '../../resolver/reducer';
import * as fromWizard from '../../../wizard/reducer';
import { MockI18nModule } from '../../../../testing/i18n.stub';

import {
    RestoreActionTypes
} from '../action/restore.action';
import { WizardActionTypes } from '../../../wizard/action/wizard.action';

@Component({
    template: `
        <restore-edit-step></restore-edit-step>
    `
})
class TestHostComponent {
    @ViewChild(RestoreEditStepComponent)
    public componentUnderTest: RestoreEditStepComponent;
}

describe('Restore Version Edit Step Component', () => {

    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let app: RestoreEditStepComponent;
    let store: Store<fromConfiguration.State>;
    let dispatchSpy;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NgbDropdownModule,
                StoreModule.forRoot({
                    'metadata-configuration': combineReducers(fromConfiguration.reducers),
                    'provider': combineReducers(fromProviders.reducers),
                    'resolver': combineReducers(fromResolvers.reducers),
                    'wizard': combineReducers(fromWizard.reducers)
                }),
                MockI18nModule,
                RouterTestingModule
            ],
            declarations: [
                RestoreEditStepComponent,
                TestHostComponent
            ],
            schemas: [
                NO_ERRORS_SCHEMA
            ]
        }).compileComponents();

        store = TestBed.get(Store);
        dispatchSpy = spyOn(store, 'dispatch');

        fixture = TestBed.createComponent(TestHostComponent);
        instance = fixture.componentInstance;
        app = instance.componentUnderTest;
        fixture.detectChanges();
    }));

    it('should compile', () => {
        expect(app).toBeTruthy();
    });

    describe('onChange', () => {
        it('should dispatch an update changes event', () => {
            app.onChange({ name: 'test' });
            expect(store.dispatch).toHaveBeenCalled();
            expect(dispatchSpy.calls.mostRecent().args[0].type).toBe(RestoreActionTypes.UPDATE_RESTORATION_REQUEST);
        });
    });

    describe('updateStatus', () => {
        it('should dispatch an update form status event', () => {
            app.updateStatus({ value: 'foo' }, 'common');
            expect(store.dispatch).toHaveBeenCalled();
            expect(dispatchSpy.calls.mostRecent().args[0].type).toBe(RestoreActionTypes.UPDATE_STATUS);
        });

        it('should dispatch an update form status event', () => {
            app.updateStatus({}, 'common');
            expect(store.dispatch).toHaveBeenCalled();
            expect(dispatchSpy.calls.mostRecent().args[0].type).toBe(RestoreActionTypes.UPDATE_STATUS);
        });
    });

    describe('updateLock', () => {
        it('should dispatch a LockEditor event when passed a locked status', () => {
            app.updateLock(true);
            expect(store.dispatch).toHaveBeenCalled();
            expect(dispatchSpy.calls.mostRecent().args[0].type).toBe(WizardActionTypes.LOCK);
        });

        it('should dispatch a UnlockEditor event when passed a locked status', () => {
            app.updateLock(false);
            expect(store.dispatch).toHaveBeenCalled();
            expect(dispatchSpy.calls.mostRecent().args[0].type).toBe(WizardActionTypes.UNLOCK);
        });
    });
});

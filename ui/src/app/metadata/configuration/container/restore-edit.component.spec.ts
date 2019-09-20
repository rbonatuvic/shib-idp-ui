import { Component, ViewChild, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, combineReducers, Store } from '@ngrx/store';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { RestoreEditComponent } from './restore-edit.component';
import * as fromConfiguration from '../reducer';
import * as fromProviders from '../../provider/reducer';
import * as fromResolvers from '../../resolver/reducer';
import { MockI18nModule } from '../../../../testing/i18n.stub';
import { RestoreActionTypes } from '../action/restore.action';

@Component({
    template: `
        <restore-edit></restore-edit>
    `
})
class TestHostComponent {
    @ViewChild(RestoreEditComponent)
    public componentUnderTest: RestoreEditComponent;
}

describe('Restore Version Edit Component', () => {

    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let app: RestoreEditComponent;
    let store: Store<fromConfiguration.State>;
    let dispatchSpy;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NgbDropdownModule,
                StoreModule.forRoot({
                    'metadata-configuration': combineReducers(fromConfiguration.reducers),
                    'provider': combineReducers(fromProviders.reducers),
                    'resolver': combineReducers(fromResolvers.reducers)
                }),
                MockI18nModule,
                RouterTestingModule
            ],
            declarations: [
                RestoreEditComponent,
                TestHostComponent
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
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

    describe('save', () => {
        it('should dispatch a save request event', () => {
            app.save();
            expect(store.dispatch).toHaveBeenCalled();
            expect(dispatchSpy.calls.mostRecent().args[0].type).toBe(RestoreActionTypes.RESTORE_VERSION_REQUEST);
        });
    });

    describe('cancel', () => {
        it('should dispatch a cancel request event', () => {
            app.cancel();
            expect(store.dispatch).toHaveBeenCalled();
            expect(dispatchSpy.calls.mostRecent().args[0].type).toBe(RestoreActionTypes.CANCEL_RESTORE);
        });
    });
});

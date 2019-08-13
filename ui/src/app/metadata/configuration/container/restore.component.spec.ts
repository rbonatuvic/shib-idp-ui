import { Component, ViewChild, Input } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, combineReducers, Store } from '@ngrx/store';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import * as fromConfiguration from '../reducer';
import * as fromProviders from '../../provider/reducer';
import * as fromResolvers from '../../resolver/reducer';
import { MockI18nModule } from '../../../../testing/i18n.stub';
import { RestoreComponent } from './restore.component';
import { of } from 'rxjs';

@Component({
    template: `
        <restore-component></restore-component>
    `
})
class TestHostComponent {
    @ViewChild(RestoreComponent)
    public componentUnderTest: RestoreComponent;
}

describe('Metadata Restore Page Component', () => {

    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let app: RestoreComponent;
    let store: Store<fromConfiguration.State>;

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
                RestoreComponent,
                TestHostComponent
            ],
        }).compileComponents();

        store = TestBed.get(Store);
        spyOn(store, 'dispatch');
        spyOn(store, 'select').and.callFake(() => of(new Date().toDateString()));

        fixture = TestBed.createComponent(TestHostComponent);
        instance = fixture.componentInstance;
        app = instance.componentUnderTest;
        fixture.detectChanges();
    }));

    it('should load metadata objects', async(() => {
        expect(app).toBeTruthy();
        expect(store.select).toHaveBeenCalledTimes(4);
        expect(store.dispatch).not.toHaveBeenCalled();
    }));

    describe('restore method', () => {
        it('should emit a value from the restore subject', () => {
            spyOn(app.subj, 'next').and.callThrough();
            app.restore();
            expect(app.subj.next).toHaveBeenCalled();
        });
    });
});

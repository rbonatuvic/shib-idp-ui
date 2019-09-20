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
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

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
    let router: Router;

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
            providers: [
                DatePipe
            ]
        }).compileComponents();

        store = TestBed.get(Store);
        router = TestBed.get(Router);
        spyOn(store, 'dispatch');
        spyOn(store, 'select').and.callFake(() => of(new Date().toDateString()));

        fixture = TestBed.createComponent(TestHostComponent);
        instance = fixture.componentInstance;
        app = instance.componentUnderTest;
        fixture.detectChanges();
    }));

    it('should load metadata objects', async(() => {
        expect(app).toBeTruthy();
        expect(store.select).toHaveBeenCalledTimes(2);
        expect(store.dispatch).not.toHaveBeenCalled();
    }));

    describe('restore method', () => {
        it('should navigate to the restore edit page', () => {
            spyOn(router, 'navigate').and.callThrough();
            app.restore();
            expect(router.navigate).toHaveBeenCalled();
        });
    });
});

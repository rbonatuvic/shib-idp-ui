import { Component, ViewChild } from '@angular/core';
import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { FormsModule } from '@angular/forms';

import { NgbModalStub } from '../../../testing/modal.stub';
import { AccessRequestComponent } from './access-request.component';
import * as fromAdmin from '../reducer';
import * as fromCore from '../../core/reducer';

@Component({
    template: `
        <access-request-component></access-request-component>
    `
})
class TestHostComponent {
    @ViewChild(AccessRequestComponent, { static: true })
    public componentUnderTest: AccessRequestComponent;
}

describe('Access Request Component', () => {

    let app: AccessRequestComponent;
    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let store: Store<fromAdmin.State>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule,
                NgbDropdownModule,
                RouterTestingModule,
                StoreModule.forRoot({
                    admin: combineReducers(fromAdmin.reducers),
                    core: combineReducers(fromCore.reducers)
                })
            ],
            declarations: [
                AccessRequestComponent,
                TestHostComponent
            ],
            providers: [
                {
                    provide: NgbModal,
                    useClass: NgbModalStub
                }
            ]
        }).compileComponents();

        store = TestBed.get(Store);
        spyOn(store, 'dispatch');

        fixture = TestBed.createComponent(TestHostComponent);
        instance = fixture.componentInstance;
        app = instance.componentUnderTest;
        fixture.detectChanges();
    }));

    it('should compile without error', waitForAsync(() => {
        expect(app).toBeTruthy();
    }));
});

import { Component, ViewChild } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { NgbDropdownModule, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { UserManagementComponent } from './user-management.component';
import { NgbModalStub } from '../../../testing/modal.stub';
import * as fromAdmin from '../reducer';
import * as fromCore from '../../core/reducer';

@Component({
    template: `
        <user-management></user-management>
    `
})
class TestHostComponent {
    @ViewChild(UserManagementComponent, { static: true })
    public componentUnderTest: UserManagementComponent;
}

describe('User Management Component', () => {

    let app: UserManagementComponent;
    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let store: Store<fromAdmin.State>;

    beforeEach(async(() => {
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
                UserManagementComponent,
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

    it('should compile without error', async(() => {
        expect(app).toBeTruthy();
    }));
});

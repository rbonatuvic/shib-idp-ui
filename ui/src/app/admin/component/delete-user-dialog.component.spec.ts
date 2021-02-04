import { Component, ViewChild } from '@angular/core';
import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { NgbDropdownModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { DeleteUserDialogComponent } from './delete-user-dialog.component';

@Component({
    template: `
        <delete-user-dialog></delete-user-dialog>
    `
})
class TestHostComponent {
    @ViewChild(DeleteUserDialogComponent, { static: true })
    public componentUnderTest: DeleteUserDialogComponent;
}

describe('Delete Dialog (modal) Component', () => {

    let app: DeleteUserDialogComponent;
    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                NgbDropdownModule,
                RouterTestingModule
            ],
            declarations: [
                DeleteUserDialogComponent,
                TestHostComponent
            ],
            providers: [
                {
                    provide: NgbActiveModal,
                    useValue: jasmine.createSpyObj('activeModal', [
                        'close',
                        'dismiss'
                    ])
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        instance = fixture.componentInstance;
        app = instance.componentUnderTest;
        fixture.detectChanges();
    }));

    it('should compile without error', waitForAsync(() => {
        expect(app).toBeTruthy();
    }));
});

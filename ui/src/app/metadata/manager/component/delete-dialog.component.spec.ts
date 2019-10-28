import { Component, ViewChild } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { NgbDropdownModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { DeleteDialogComponent } from './delete-dialog.component';

@Component({
    template: `
        <delete-dialog></delete-dialog>
    `
})
class TestHostComponent {
    @ViewChild(DeleteDialogComponent, { static: true })
    public componentUnderTest: DeleteDialogComponent;
}

describe('Delete Dialog (modal) Component', () => {

    let app: DeleteDialogComponent;
    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NgbDropdownModule,
                RouterTestingModule
            ],
            declarations: [
                DeleteDialogComponent,
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

    it('should compile without error', async(() => {
        expect(app).toBeTruthy();
    }));
});

import { Component, ViewChild } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { NgbDropdownModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { DeleteFilterComponent } from './delete-filter.component';

@Component({
    template: `
        <delete-filter-dialog></delete-filter-dialog>
    `
})
class TestHostComponent {
    @ViewChild(DeleteFilterComponent, { static: true })
    public componentUnderTest: DeleteFilterComponent;
}

describe('Delete Filter (modal) Component', () => {

    let app: DeleteFilterComponent;
    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NgbDropdownModule,
                RouterTestingModule
            ],
            declarations: [
                DeleteFilterComponent,
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

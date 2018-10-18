import { Component, ViewChild } from '@angular/core';
import { TestBed, async, ComponentFixture} from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UnsavedEntityComponent } from './unsaved-entity.dialog';
import { NgbActiveModalStub } from '../../../../testing/modal.stub';
import { MockI18nModule } from '../../../../testing/i18n.stub';

@Component({
    template: `
        <unsaved-entity></unsaved-entity>
    `
})
class TestHostComponent {
    @ViewChild(UnsavedEntityComponent)
    public componentUnderTest: UnsavedEntityComponent;
}

describe('Unsaved Provider Dialog Component', () => {

    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let cmp: UnsavedEntityComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MockI18nModule
            ],
            declarations: [
                UnsavedEntityComponent,
                TestHostComponent
            ],
            providers: [
                { provide: NgbActiveModal, useClass: NgbActiveModalStub }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        instance = fixture.componentInstance;
        cmp = instance.componentUnderTest;
        fixture.detectChanges();
    }));

    it('should instantiate the component', async(() => {
        expect(cmp).toBeTruthy();
    }));
});

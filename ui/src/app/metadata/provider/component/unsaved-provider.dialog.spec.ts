import { Component, ViewChild } from '@angular/core';
import { TestBed, async, ComponentFixture} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../shared/shared.module';
import { UnsavedProviderComponent } from './unsaved-provider.dialog';
import { NgbActiveModalStub } from '../../../../testing/modal.stub';
import { MockI18nModule } from '../../../../testing/i18n.stub';

@Component({
    template: `
        <unsaved-provider></unsaved-provider>
    `
})
class TestHostComponent {
    @ViewChild(UnsavedProviderComponent)
    public componentUnderTest: UnsavedProviderComponent;
}

describe('Unsaved Provider Dialog Component', () => {

    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let cmp: UnsavedProviderComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MockI18nModule
            ],
            declarations: [
                UnsavedProviderComponent,
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

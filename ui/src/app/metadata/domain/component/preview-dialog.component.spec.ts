import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ViewChild, Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PreviewDialogComponent } from './preview-dialog.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModalStub } from '../../../../testing/modal.stub';
import { MockI18nModule } from '../../../../testing/i18n.stub';

@Component({
    template: `<preview-dialog></preview-dialog>`
})
class TestHostComponent {
    @ViewChild(PreviewDialogComponent, {static: true})
    public formUnderTest: PreviewDialogComponent;
}


describe('Advanced Info Form Component', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: NgbActiveModal, useClass: NgbActiveModalStub }
            ],
            imports: [
                NoopAnimationsModule,
                ReactiveFormsModule,
                MockI18nModule
            ],
            declarations: [
                PreviewDialogComponent,
                TestHostComponent
            ],
        });

        fixture = TestBed.createComponent(TestHostComponent);
        instance = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should compile', () => {
        expect(fixture).toBeDefined();
    });
});

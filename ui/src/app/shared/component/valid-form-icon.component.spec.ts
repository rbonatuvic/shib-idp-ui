import { Component, ViewChild, Renderer, RootRenderer } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { MockI18nModule } from '../../../testing/i18n.stub';
import { ValidFormIconComponent } from './valid-form-icon.component';

@Component({
    template: `
        <valid-form-icon [status]="status"></valid-form-icon>
    `
})
class TestHostComponent {
    @ViewChild(ValidFormIconComponent, { static: true })
    public componentUnderTest: ValidFormIconComponent;

    public status = 'INVALID';
}

describe('Info Icon Component', () => {

    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let app: ValidFormIconComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NgbPopoverModule,
                MockI18nModule
            ],
            declarations: [
                TestHostComponent,
                ValidFormIconComponent
            ],
            providers: [
                Renderer
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        instance = fixture.componentInstance;
        app = instance.componentUnderTest;
        fixture.detectChanges();
    }));

    it('should display an information icon', async(() => {
        expect(app).toBeTruthy();
    }));
});

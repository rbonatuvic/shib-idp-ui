import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ViewChild, Component } from '@angular/core';
import { ToggleSwitchComponent } from './switch.component';


@Component({
    template: `<toggle-switch [formControl]="foo"></toggle-switch>`
})
class TestHostComponent {

    foo: FormControl = new FormControl(false);

    @ViewChild(ToggleSwitchComponent)
    public instanceUnderTest: ToggleSwitchComponent;
}


describe('Toggle Switch Component', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let cmp: ToggleSwitchComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [],
            imports: [
                NoopAnimationsModule,
                ReactiveFormsModule,
                FormsModule
            ],
            declarations: [
                ToggleSwitchComponent,
                TestHostComponent
            ],
        });

        fixture = TestBed.createComponent(TestHostComponent);
        instance = fixture.componentInstance;
        cmp = instance.instanceUnderTest;
        fixture.detectChanges();
    });

    it('should compile', () => {
        expect(fixture).toBeDefined();
    });

    describe('value getter', () => {
        it('should return the checked value', () => {
            expect(cmp.value).toBe(false);
        });
    });

    describe('setDisabledState', () => {
        it('should set the disabled property', () => {
            cmp.setDisabledState(true);
            expect(cmp.disabled).toBe(true);
        })
    });
});

import { Component, ViewChild, RootRenderer, Renderer2 } from '@angular/core';
import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { MockI18nModule } from '../../../testing/i18n.stub';
import { InfoIconComponent } from './info-icon.component';

@Component({
    template: `
        <info-icon [description]="description"></info-icon>
    `
})
class TestHostComponent {
    @ViewChild(InfoIconComponent, { static: true })
    public componentUnderTest: InfoIconComponent;

    public description = 'Foo bar baz';
}

describe('Info Icon Component', () => {

    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let app: InfoIconComponent;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                NgbPopoverModule,
                MockI18nModule
            ],
            declarations: [
                TestHostComponent,
                InfoIconComponent
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

    it('should display an information icon', waitForAsync(() => {
        expect(app).toBeTruthy();
    }));
});

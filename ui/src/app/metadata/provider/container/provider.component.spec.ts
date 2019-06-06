import { Component, ViewChild } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { ProviderComponent } from './provider.component';

@Component({
    template: `
        <provider-page></provider-page>
    `
})
class TestHostComponent {
    @ViewChild(ProviderComponent)
    public componentUnderTest: ProviderComponent;
}

describe('Provider Component', () => {

    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let app: ProviderComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NgbDropdownModule,
                RouterTestingModule
            ],
            declarations: [
                ProviderComponent,
                TestHostComponent
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        instance = fixture.componentInstance;
        app = instance.componentUnderTest;
        fixture.detectChanges();
    }));

    it('should instantiate the component', async(() => {
        expect(app).toBeTruthy();
    }));
});

import { Component, ViewChild, Input } from '@angular/core';
import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { NgbDropdownModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { Property } from '../../../domain/model/property';
import { MockI18nModule } from '../../../../../testing/i18n.stub';
import { PrimitivePropertyComponent } from './primitive-property.component';

@Component({
    template: `
        <primitive-property [property]="property"></primitive-property>
    `
})
class TestHostComponent {
    @ViewChild(PrimitivePropertyComponent, {static: true})
    public componentUnderTest: PrimitivePropertyComponent;

    property: Property = {
        title: 'foo',
        type: 'string',
        name: 'foo',
        value: ['bar'],
        items: null,
        properties: null,
        widget: {
            id: 'string'
        }
    };
}

describe('Primitive Property Component', () => {

    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let app: PrimitivePropertyComponent;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                NgbDropdownModule,
                NgbPopoverModule,
                MockI18nModule,
                RouterTestingModule
            ],
            declarations: [
                PrimitivePropertyComponent,
                TestHostComponent
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        instance = fixture.componentInstance;
        app = instance.componentUnderTest;
        fixture.detectChanges();
    }));

    it('should accept a property input', waitForAsync(() => {
        expect(app).toBeTruthy();
    }));
});

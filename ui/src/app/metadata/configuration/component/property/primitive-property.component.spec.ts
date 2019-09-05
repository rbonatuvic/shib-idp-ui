import { Component, ViewChild, Input } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { Property } from '../../../domain/model/property';
import { MockI18nModule } from '../../../../../testing/i18n.stub';
import { PrimitivePropertyComponent } from './primitive-property.component';

@Component({
    template: `
        <primitive-property [property]="property"></primitive-property>
    `
})
class TestHostComponent {
    @ViewChild(PrimitivePropertyComponent)
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

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NgbDropdownModule,
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

    it('should accept a property input', async(() => {
        expect(app).toBeTruthy();
    }));
});

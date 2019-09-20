import { Component, ViewChild } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { Property } from '../../../domain/model/property';
import { MockI18nModule } from '../../../../../testing/i18n.stub';
import { ObjectPropertyComponent } from './object-property.component';
import { SCHEMA } from '../../../../../testing/form-schema.stub';
import { getStepProperty } from '../../../domain/utility/configuration';
import { PrimitivePropertyComponent } from './primitive-property.component';
import { ArrayPropertyComponent } from './array-property.component';
import { FilterTargetPropertyComponent } from './filter-target-property.component';

@Component({
    template: `
        <object-property [property]="property"></object-property>
    `
})
class TestHostComponent {
    @ViewChild(ObjectPropertyComponent)
    public componentUnderTest: ObjectPropertyComponent;

    property: Property = getStepProperty(SCHEMA.properties.name, {
        name: 'foo',
        type: 'baz',
        description: 'foo bar baz'
    }, SCHEMA.definitions);
}

describe('Object Property Component', () => {

    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let app: ObjectPropertyComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NgbPopoverModule,
                MockI18nModule,
                RouterTestingModule
            ],
            declarations: [
                ObjectPropertyComponent,
                PrimitivePropertyComponent,
                ArrayPropertyComponent,
                FilterTargetPropertyComponent,
                TestHostComponent
            ]
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

import { Component, ViewChild } from '@angular/core';
import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { Property } from '../../../domain/model/property';
import { MockI18nModule } from '../../../../../testing/i18n.stub';
import { SCHEMA } from '../../../../../testing/form-schema.stub';
import { getStepProperty } from '../../../domain/utility/configuration';
import { FilterTargetPropertyComponent } from './filter-target-property.component';
import { ArrayPropertyComponentStub, PrimitivePropertyComponentStub } from '../../../../../testing/property-component.stub';

@Component({
    template: `
        <filter-target-property [property]="property"></filter-target-property>
    `
})
class TestHostComponent {
    @ViewChild(FilterTargetPropertyComponent, {static: true})
    public componentUnderTest: FilterTargetPropertyComponent;

    property: Property = getStepProperty(SCHEMA.properties.formatFilterTarget, {
        formatFilterTargetType: 'ENTITY_ID',
        value: [
            'foo',
            'bar',
            'baz'
        ]
    }, SCHEMA.definitions);
}

describe('Filter Target Property Component', () => {

    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let app: FilterTargetPropertyComponent;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                NgbPopoverModule,
                MockI18nModule,
                RouterTestingModule
            ],
            declarations: [
                FilterTargetPropertyComponent,
                PrimitivePropertyComponentStub,
                ArrayPropertyComponentStub,
                TestHostComponent
            ],
            providers: []
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

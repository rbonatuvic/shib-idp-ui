import { Component, ViewChild, Input } from '@angular/core';
import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { NgbDropdownModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { Property } from '../../../domain/model/property';
import { MockI18nModule } from '../../../../../testing/i18n.stub';
import { SCHEMA } from '../../../../../testing/form-schema.stub';
import { getStepProperty } from '../../../domain/utility/configuration';
import { ArrayPropertyComponent } from './array-property.component';
import { AttributesService } from '../../../domain/service/attributes.service';
import { MockAttributeService } from '../../../../../testing/attributes.stub';
import { of } from 'rxjs';

@Component({
    template: `
        <array-property [property]="property"></array-property>
    `
})
class TestHostComponent {
    @ViewChild(ArrayPropertyComponent, {static: true})
    public componentUnderTest: ArrayPropertyComponent;

    property: Property = getStepProperty(SCHEMA.properties.list, [{
        name: 'foo',
        type: 'baz',
        description: 'foo bar baz',
        list: []
    }], SCHEMA.definitions);

    setProperty(property: Property): void {
        this.property = property;
    }
}

describe('Array Property Component', () => {

    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let app: ArrayPropertyComponent;
    let service: AttributesService;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                NgbPopoverModule,
                MockI18nModule,
                RouterTestingModule
            ],
            declarations: [
                ArrayPropertyComponent,
                TestHostComponent
            ],
            providers: [
                { provide: AttributesService, useClass: MockAttributeService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        instance = fixture.componentInstance;
        app = instance.componentUnderTest;
        service = TestBed.get(AttributesService);
        fixture.detectChanges();
    }));

    it('should accept a property input', waitForAsync(() => {
        expect(app).toBeTruthy();
    }));

    describe('attributeList$ getter', () => {
        it('should return an empty list when no data or dataUrl is set', () => {
            expect(app.dataList).toBeUndefined();
        });
        it('should return a list of data items from the schema', () => {
            const datalist = [
                { key: 'foo', label: 'foo' },
                { key: 'bar', label: 'bar' },
                { key: 'baz', label: 'baz' },
            ];
            instance.setProperty({
                ...instance.property,
                widget: {
                    id: 'datalist',
                    data: datalist
                }
            });
            fixture.detectChanges();
            expect(app.dataList).toEqual(datalist);
        });
    });
});

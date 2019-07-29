import { Component, ViewChild, Input } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { NgbDropdownModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { Property } from '../../domain/model/property';
import { MockI18nModule } from '../../../../testing/i18n.stub';
import { SCHEMA } from '../../../../testing/form-schema.stub';
import { getStepProperties, getStepProperty } from '../../domain/utility/configuration';
import { ConfigurationPropertyComponent } from './configuration-property.component';

@Component({
    template: `
        <configuration-property [property]="property"></configuration-property>
    `
})
class TestHostComponent {
    @ViewChild(ConfigurationPropertyComponent)
    public componentUnderTest: ConfigurationPropertyComponent;

    property: Property = getStepProperty(SCHEMA.properties.name, {
        name: 'foo',
        type: 'baz',
        description: 'foo bar baz'
    }, SCHEMA.definitions);
}

describe('Configuration Property Component', () => {

    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let app: ConfigurationPropertyComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NgbPopoverModule,
                MockI18nModule,
                RouterTestingModule
            ],
            declarations: [
                ConfigurationPropertyComponent,
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

    describe('getKeys method', () => {
        it('should return the property`s child keys', () => {
            expect(app.getKeys({ properties: { foo: 'bar', baz: 'bar' } })).toEqual(['foo', 'baz']);
        });
    });

    describe('getItemType method', () => {
        it('should return the item`s type', () => {
            expect(app.getItemType({items: { widget: { id: 'string' } } } as Property)).toBe('string');
            expect(app.getItemType({items: {}} as Property)).toBe('default');
            expect(app.getItemType({} as Property)).toBe('default');
        });
    });
});

import { Component, ViewChild } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { NgbDropdownModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import { SummaryPropertyComponent } from './summary-property.component';
import { SchemaFormModule, WidgetRegistry, DefaultWidgetRegistry } from 'ngx-schema-form';
import { Property } from '../model/property';
import { MockI18nModule } from '../../../../testing/i18n.stub';
import { AttributesService } from '../service/attributes.service';
import { of } from 'rxjs';

@Component({
    template: `
        <summary-property [property]="property"></summary-property>
    `
})
class TestHostComponent {
    @ViewChild(SummaryPropertyComponent, {static: true})
    public componentUnderTest: SummaryPropertyComponent;

    private _property;

    get property(): Property {
        return this._property;
    }

    set property(prop: Property) {
        this._property = prop;
    }
}

describe('Summary Property Component', () => {

    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let app: SummaryPropertyComponent;
    let service: AttributesService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NgbDropdownModule,
                NgbPopoverModule,
                RouterTestingModule,
                SchemaFormModule.forRoot(),
                MockI18nModule
            ],
            declarations: [
                SummaryPropertyComponent,
                TestHostComponent
            ],
            providers: [
                { provide: WidgetRegistry, useClass: DefaultWidgetRegistry },
                { provide: AttributesService, useValue: {
                    query: (path: string) => of([])
                } }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        instance = fixture.componentInstance;
        app = instance.componentUnderTest;
        service = TestBed.get(AttributesService);
        fixture.detectChanges();
    }));

    it('should instantiate the component', async(() => {
        expect(app).toBeTruthy();
    }));

    describe('attribute list getter', () => {
        it('should return the data from the property schema', async(() => {
            let list = [{ key: 'foo', label: 'foo' }];
            app.property = {
                type: 'array',
                name: 'foo',
                value: ['foo', 'bar'],
                items: null,
                properties: null,
                widget: {
                    id: 'foo',
                    data: list
                }
            };

            app.attributeList$.subscribe(l => {
                expect(l).toEqual(list);
            });
        }));

        it('should return fetch data from the supplied path', async(() => {
            let list = [{key: 'foo', label: 'foo'}];
            spyOn(service, 'query').and.returnValue(of(list));
            app.property = {
                type: 'array',
                name: 'foo',
                value: ['foo', 'bar'],
                items: null,
                properties: null,
                widget: {
                    id: 'foo',
                    dataUrl: 'foo'
                }
            };

            app.attributeList$.subscribe(l => {
                expect(l).toEqual(list);
            });
        }));

        it('should return an empty array if no data is found', async(() => {
            let list = [];
            spyOn(service, 'query').and.returnValue(of(list));
            app.property = {
                type: 'array',
                name: 'foo',
                value: ['foo', 'bar'],
                items: null,
                properties: null
            };

            app.attributeList$.subscribe(l => {
                expect(l).toEqual(list);
            });
        }));
    });
});

import { Component, ViewChild } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { NgbDropdownModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import { SummaryPropertyComponent } from './summary-property.component';
import { SchemaFormModule, WidgetRegistry, DefaultWidgetRegistry } from 'ngx-schema-form';
import { Property } from '../model/property';
import { MockI18nModule } from '../../../../testing/i18n.stub';

@Component({
    template: `
        <summary-property [property]="property"></summary-property>
    `
})
class TestHostComponent {
    @ViewChild(SummaryPropertyComponent)
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

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NgbDropdownModule.forRoot(),
                NgbPopoverModule.forRoot(),
                RouterTestingModule,
                SchemaFormModule.forRoot(),
                MockI18nModule
            ],
            declarations: [
                SummaryPropertyComponent,
                TestHostComponent
            ],
            providers: [
                { provide: WidgetRegistry, useClass: DefaultWidgetRegistry }
            ]
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

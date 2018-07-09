import { Component, ViewChild } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, Store, combineReducers } from '@ngrx/store';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { SummaryPropertyComponent } from './summary-property.component';
import * as fromRoot from '../reducer';
import { SchemaFormModule, WidgetRegistry, DefaultWidgetRegistry } from 'ngx-schema-form';
import * as fromWizard from '../../../wizard/reducer';
import { Wizard } from '../../../wizard/model';
import { MetadataProvider } from '../../domain/model';
import { Property } from '../model/property';

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
    let store: Store<fromRoot.State>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NgbDropdownModule.forRoot(),
                RouterTestingModule,
                SchemaFormModule.forRoot(),
                StoreModule.forRoot({
                    provider: combineReducers(fromRoot.reducers),
                    wizard: combineReducers(fromWizard.reducers)
                })
            ],
            declarations: [
                SummaryPropertyComponent,
                TestHostComponent
            ],
            providers: [
                { provide: WidgetRegistry, useClass: DefaultWidgetRegistry }
            ]
        }).compileComponents();

        store = TestBed.get(Store);
        spyOn(store, 'dispatch');

        fixture = TestBed.createComponent(TestHostComponent);
        instance = fixture.componentInstance;
        app = instance.componentUnderTest;
        fixture.detectChanges();
    }));

    it('should instantiate the component', async(() => {
        expect(app).toBeTruthy();
    }));
});

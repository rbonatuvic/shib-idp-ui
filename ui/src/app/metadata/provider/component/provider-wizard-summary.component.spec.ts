import { Component, ViewChild } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, Store, combineReducers } from '@ngrx/store';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { ProviderWizardSummaryComponent, getStepProperties } from './provider-wizard-summary.component';
import * as fromRoot from '../reducer';
import { SchemaFormModule, WidgetRegistry, DefaultWidgetRegistry } from 'ngx-schema-form';
import * as fromWizard from '../../../wizard/reducer';
import { Wizard } from '../../../wizard/model';
import { MetadataProvider } from '../../domain/model';
import { SummaryPropertyComponent } from './summary-property.component';
import { SCHEMA } from '../../../../testing/form-schema.stub';
import { MetadataProviderWizard } from '../model';

@Component({
    template: `
        <provider-wizard-summary [summary]="summary"></provider-wizard-summary>
    `
})
class TestHostComponent {
    @ViewChild(ProviderWizardSummaryComponent)
    public componentUnderTest: ProviderWizardSummaryComponent;

    private _summary;

    get summary(): { definition: Wizard<MetadataProvider>, schema: { [id: string]: any }, model: any } {
        return this._summary;
    }

    set summary(summary: { definition: Wizard<MetadataProvider>, schema: { [id: string]: any }, model: any }) {
        this._summary = summary;
    }
}

describe('Provider Wizard Summary Component', () => {

    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let app: ProviderWizardSummaryComponent;
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
                ProviderWizardSummaryComponent,
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

    describe('getStepProperties function', () => {
        it('should return an empty array of schema or schema.properties is not defined', () => {
            expect(getStepProperties(null, {})).toEqual([]);
            expect(getStepProperties({}, {})).toEqual([]);
        });

        it('should return a formatted list of properties', () => {
            expect(getStepProperties(SCHEMA, {}).length).toBe(2);
        });
    });

    describe('gotoPage function', () => {
        it('should emit an empty string if page is null', () => {
            spyOn(app.onPageSelect, 'emit');
            app.gotoPage();
            expect(app.onPageSelect.emit).toHaveBeenCalledWith('');
        });

        it('should emit the provided page', () => {
            spyOn(app.onPageSelect, 'emit');
            app.gotoPage('foo');
            expect(app.onPageSelect.emit).toHaveBeenCalledWith('foo');
        });
    });

    describe('ngOnChanges', () => {
        it('should set columns and sections if summary is provided', () => {
            instance.summary = {
                model: {
                    name: 'foo',
                    '@type': 'MetadataProvider'
                },
                schema: SCHEMA,
                definition: MetadataProviderWizard
            };
            fixture.detectChanges();
            expect(app.sections).toBeDefined();
            expect(app.columns).toBeDefined();
        });
    });
});

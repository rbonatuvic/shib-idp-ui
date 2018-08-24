import { Component, ViewChild } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, Store, combineReducers } from '@ngrx/store';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import * as fromRoot from '../reducer';
import { SchemaFormModule, WidgetRegistry, DefaultWidgetRegistry } from 'ngx-schema-form';
import * as fromWizard from '../../../wizard/reducer';
import { ProviderEditorNavComponent, NAV_FORMATS } from './provider-editor-nav.component';
import { I18nTextComponent } from '../../../shared/component/i18n-text.component';
import { ValidFormIconComponent } from '../../../shared/component/valid-form-icon.component';
import { WizardStep } from '../../../wizard/model';

@Component({
    template: `
        <provider-editor-nav [format]="format.TABS"></provider-editor-nav>
    `
})
class TestHostComponent {
    @ViewChild(ProviderEditorNavComponent)
    public componentUnderTest: ProviderEditorNavComponent;

    public format = NAV_FORMATS;
}

describe('Provider Editor Nav Component', () => {

    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let app: ProviderEditorNavComponent;
    let store: Store<fromRoot.State>;

    let step: WizardStep = {
        id: 'common',
        label: 'Common Attributes',
        index: 2,
        initialValues: [],
        schema: 'assets/schema/provider/filebacked-http-common.schema.json'
    };

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
                ProviderEditorNavComponent,
                I18nTextComponent,
                ValidFormIconComponent,
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

    describe('getFilterId', () => {
        it('should return a string based on provided step', () => {
            expect(app.getFilterId(step)).toEqual(step.id);
        });

        it('should return "Filter List" when step is null', () => {
            expect(app.getFilterId(null)).toEqual('filters');
        });
    });

    describe('getFilterLabel', () => {
        it('should return a string based on provided step', () => {
            expect(app.getFilterLabel(step)).toEqual(step.label);
        });
        it('should return "Filter List" when step is null', () => {
            expect(app.getFilterLabel(null)).toEqual('Filter List');
        });
    });
});

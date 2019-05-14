import { Component, ViewChild } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, Store, combineReducers } from '@ngrx/store';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { SchemaFormModule, WidgetRegistry, DefaultWidgetRegistry } from 'ngx-schema-form';
import * as fromWizard from '../../../wizard/reducer';
import { EditorNavComponent, NAV_FORMATS } from './editor-nav.component';
import { ValidFormIconComponent } from '../../../shared/component/valid-form-icon.component';
import { WizardStep } from '../../../wizard/model';
import { MockI18nModule } from '../../../../testing/i18n.stub';

@Component({
    template: `
        <editor-nav [format]="format.TABS"></editor-nav>
    `
})
class TestHostComponent {
    @ViewChild(EditorNavComponent)
    public componentUnderTest: EditorNavComponent;

    public format = NAV_FORMATS;
}

describe('Editor Nav Component', () => {

    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let app: EditorNavComponent;
    let store: Store<fromWizard.State>;

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
                NgbDropdownModule,
                RouterTestingModule,
                SchemaFormModule.forRoot(),
                StoreModule.forRoot({
                    wizard: combineReducers(fromWizard.reducers)
                }),
                MockI18nModule
            ],
            declarations: [
                EditorNavComponent,
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

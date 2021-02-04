import { Component, ViewChild } from '@angular/core';
import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, Store, combineReducers } from '@ngrx/store';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { ProviderWizardStepComponent } from './provider-wizard-step.component';
import * as fromRoot from '../reducer';
import { SchemaFormModule, WidgetRegistry, DefaultWidgetRegistry } from 'ngx-schema-form';
import * as fromWizard from '../../../wizard/reducer';
import { SCHEMA } from '../../../../testing/form-schema.stub';
import { MetadataProviderWizard } from '../model';

@Component({
    template: `
        <provider-wizard-step></provider-wizard-step>
    `
})
class TestHostComponent {
    @ViewChild(ProviderWizardStepComponent, {static: true})
    public componentUnderTest: ProviderWizardStepComponent;
}

describe('Provider Wizard Step Component', () => {

    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let app: ProviderWizardStepComponent;
    let store: Store<fromRoot.State>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                NgbDropdownModule,
                RouterTestingModule,
                SchemaFormModule.forRoot(),
                StoreModule.forRoot({
                    provider: combineReducers(fromRoot.reducers),
                    wizard: combineReducers(fromWizard.reducers)
                })
            ],
            declarations: [
                ProviderWizardStepComponent,
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

    it('should instantiate the component', waitForAsync(() => {
        expect(app).toBeTruthy();
    }));

    describe('resetSelectedType method', () => {
        it('should dispatch a SetDefinition action if the type has changed', () => {
            app.resetSelectedType({ value: { name: 'foo', '@type': 'FileBackedHttpMetadataResolver' } }, SCHEMA, MetadataProviderWizard);
            expect(store.dispatch).toHaveBeenCalled();
        });

        it('should NOT dispatch a SetDefinition action if the type hasn\'t changed', () => {
            app.resetSelectedType({ value: { name: 'foo', '@type': 'MetadataProvider' } }, SCHEMA, MetadataProviderWizard);
            expect(store.dispatch).not.toHaveBeenCalled();
        });

        it('should NOT dispatch a SetDefinition action if the type isn\'t found', () => {
            app.resetSelectedType({ value: { name: 'foo', '@type': 'FooProvider' } }, SCHEMA, MetadataProviderWizard);
            expect(store.dispatch).not.toHaveBeenCalled();
        });

        it('should return changes and definition if no type supplied', () => {
            app.resetSelectedType({ value: { name: 'foo' } }, SCHEMA, MetadataProviderWizard);
            expect(store.dispatch).not.toHaveBeenCalled();
        });
    });

    describe('updateStatus method', () => {
        it('should dispatch an UpdateStatus action', () => {
            app.updateStatus({value: { name: 'notfound'} });
            expect(store.dispatch).toHaveBeenCalled();
        });

        it('should NOT dispatch a SetDefinition action if the type hasn\'t changed', () => {
            app.updateStatus({ value: null });
            expect(store.dispatch).toHaveBeenCalled();
        });
    });
});

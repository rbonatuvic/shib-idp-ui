import { Component, ViewChild } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, Store, combineReducers } from '@ngrx/store';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { ResolverWizardStepComponent } from './resolver-wizard-step.component';
import * as fromRoot from '../reducer';
import { SchemaFormModule, WidgetRegistry, DefaultWidgetRegistry } from 'ngx-schema-form';
import * as fromWizard from '../../../wizard/reducer';
import { initialState } from '../reducer/entity.reducer';
import { MetadataSourceWizard } from '../../domain/model/wizards/metadata-source-wizard';

@Component({
    template: `
        <resolver-wizard-step></resolver-wizard-step>
    `
})
class TestHostComponent {
    @ViewChild(ResolverWizardStepComponent, {static: true})
    public componentUnderTest: ResolverWizardStepComponent;
}

describe('Resolver Wizard Step Component', () => {

    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let app: ResolverWizardStepComponent;
    let store: Store<fromRoot.State>;

    let schema = {
        type: 'object',
        properties: {
            id: {
                type: 'string'
            },
            serviceProviderName: {
                type: 'string'
            },
            entityId: {
                type: 'string'
            }
        }
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NgbDropdownModule,
                RouterTestingModule,
                SchemaFormModule.forRoot(),
                StoreModule.forRoot({
                    resolver: combineReducers(fromRoot.reducers, {
                        entity: {
                            ...initialState,
                            changes: {
                                id: 'foo',
                                serviceProviderName: 'bar',
                                createdBy: 'admin'
                            }
                        }
                    }),
                    wizard: combineReducers(fromWizard.reducers, {
                        wizard: {
                            index: 'common',
                            disabled: false,
                            definition: new MetadataSourceWizard(),
                            schemaPath: '/foo/bar',
                            loading: false,
                            schema: {
                                ...schema
                            },
                            locked: false
                        }
                    })
                })
            ],
            declarations: [
                ResolverWizardStepComponent,
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

    describe('updateStatus method', () => {
        it('should dispatch an UpdateStatus action', () => {
            app.updateStatus({ value: { name: 'notfound' } });
            expect(store.dispatch).toHaveBeenCalled();
        });

        it('should NOT dispatch a SetDefinition action if the type hasn\'t changed', () => {
            app.updateStatus({ value: null });
            expect(store.dispatch).toHaveBeenCalled();
        });
    });
});

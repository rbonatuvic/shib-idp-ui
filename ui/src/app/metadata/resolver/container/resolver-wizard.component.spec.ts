import { Component, ViewChild } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, Store, combineReducers } from '@ngrx/store';

import { NgbDropdownModule, NgbPopoverModule, NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { ResolverWizardComponent } from './resolver-wizard.component';
import * as fromRoot from '../reducer';
import { WizardModule } from '../../../wizard/wizard.module';
import { WizardSummaryComponent } from '../../domain/component/wizard-summary.component';
import { SummaryPropertyComponent } from '../../domain/component/summary-property.component';
import * as fromWizard from '../../../wizard/reducer';
import { MockI18nModule } from '../../../../testing/i18n.stub';
import { METADATA_SOURCE_WIZARD } from '../wizard-definition';
import { MetadataSourceWizard } from '../../domain/model/wizards/metadata-source-wizard';
import { initialState } from '../reducer/entity.reducer';
import { MockWizardModule } from '../../../../testing/wizard.stub';
import { RouterStateSnapshot } from '@angular/router';
import { NgbModalStub } from '../../../../testing/modal.stub';
import { of } from 'rxjs';
import { MetadataResolver } from '../../domain/model';

@Component({
    template: `
        <resolver-wizard-page></resolver-wizard-page>
    `
})
class TestHostComponent {
    @ViewChild(ResolverWizardComponent)
    public componentUnderTest: ResolverWizardComponent;
}

describe('Resolver Wizard Component', () => {

    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let app: ResolverWizardComponent;
    let store: Store<fromRoot.State>;
    let modal: NgbModal;

    let schema = {
        type: 'object',
        properties: {
            id: {
                type: 'string'
            },
            serviceProviderName: {
                type: 'string'
            }
        }
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MockWizardModule,
                NgbDropdownModule.forRoot(),
                NgbPopoverModule.forRoot(),
                RouterTestingModule,
                StoreModule.forRoot({
                    resolver: combineReducers(fromRoot.reducers, {
                        entity: {
                            ...initialState,
                            changes: {
                                id: 'foo',
                                serviceProviderName: 'bar'
                            }
                        }
                    }),
                    wizard: combineReducers(fromWizard.reducers, {
                        wizard: {
                            index: 'page',
                            disabled: false,
                            definition: new MetadataSourceWizard(),
                            schemaCollection: {
                                page: {
                                    ...schema
                                }
                            },
                            schemaPath: '/foo/bar',
                            loading: false,
                            schema: {
                                ...schema
                            },
                            locked: false
                        }
                    })
                }),
                MockI18nModule
            ],
            declarations: [
                ResolverWizardComponent,
                TestHostComponent
            ],
            providers: [
                { provide: NgbModal, useClass: NgbModalStub },
                { provide: METADATA_SOURCE_WIZARD, useValue: MetadataSourceWizard }
            ]
        }).compileComponents();

        store = TestBed.get(Store);
        spyOn(store, 'dispatch');

        fixture = TestBed.createComponent(TestHostComponent);
        instance = fixture.componentInstance;
        app = instance.componentUnderTest;
        fixture.detectChanges();

        modal = TestBed.get(NgbModal);
    }));

    it('should instantiate the component', async(() => {
        expect(app).toBeTruthy();
    }));

    describe('canDeactivate method', () => {
        it('should return true if moving to another edit page', async(() => {
            app.canDeactivate(null, null, {
                url: 'wizard'
            } as RouterStateSnapshot).subscribe((can) => {
                expect(can).toBe(true);
            });
        }));

        it('should open a modal', () => {
            app.changes = {id: 'bar', serviceProviderName: 'foo'};
            spyOn(modal, 'open').and.callThrough();
            app.canDeactivate(null, null, {
                url: 'foo'
            } as RouterStateSnapshot);
            expect(modal.open).toHaveBeenCalled();
        });

        it('should check if the entity is saved', async(() => {
            app.changes = {} as MetadataResolver;
            spyOn(store, 'select').and.returnValue(of(true));
            spyOn(modal, 'open').and.callThrough();
            app.canDeactivate(null, null, {
                url: 'foo'
            } as RouterStateSnapshot).subscribe((can) => {
                expect(can).toBe(true);
                expect(modal.open).not.toHaveBeenCalled();
            });
        }));
    });
});

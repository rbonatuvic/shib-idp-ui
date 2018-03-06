import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap/pagination/pagination.module';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap/modal/modal.module';
import { DashboardComponent } from './dashboard.component';
import * as fromDashboard from '../reducer';
import { ProviderSearchComponent } from '../component/provider-search.component';
import { ProviderItemComponent } from '../component/provider-item.component';
import { DeleteDialogComponent } from '../component/delete-dialog.component';
import { RouterStub } from '../../../testing/router.stub';
import { NgbModalStub } from '../../../testing/modal.stub';
import { MetadataProvider } from '../../metadata-provider/model/metadata-provider';


describe('Dashboard Page', () => {
    let fixture: ComponentFixture<DashboardComponent>;
    let store: Store<fromDashboard.DashboardState>;
    let router: Router;
    let modal: NgbModal;
    let instance: DashboardComponent;

    let draft = {
            entityId: 'foo',
            serviceProviderName: 'bar'
        } as MetadataProvider,
        provider = {
            ...draft,
            id: '1'
        } as MetadataProvider;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: Router, useClass: RouterStub },
                { provide: NgbModal, useClass: NgbModalStub }
            ],
            imports: [
                NoopAnimationsModule,
                StoreModule.forRoot({
                    dashboard: combineReducers(fromDashboard.reducers),
                }),
                ReactiveFormsModule,
                NgbPaginationModule,
                NgbModalModule
            ],
            declarations: [
                DashboardComponent,
                ProviderSearchComponent,
                ProviderItemComponent,
                DeleteDialogComponent
            ],
        });

        fixture = TestBed.createComponent(DashboardComponent);
        instance = fixture.componentInstance;
        store = TestBed.get(Store);
        router = TestBed.get(Router);
        modal = TestBed.get(NgbModal);

        spyOn(store, 'dispatch').and.callThrough();
    });

    it('should compile', () => {
        fixture.detectChanges();

        expect(fixture).toBeDefined();
    });

    xdescribe('getPagedProviders method', () => {});

    describe('changePage method', () => {
        it('should update the page value', () => {
            let page = 2;
            instance.changePage(page);
            expect(instance.page).toBe(page);
        });

        it('should update the paged providers list', () => {
            let page = 2;
            spyOn(instance, 'getPagedProviders');
            instance.changePage(page);
            expect(instance.getPagedProviders).toHaveBeenCalled();
        });
    });

    describe('toggleProvider method', () => {
        it('should fire a redux action', () => {
            instance.toggleProvider(draft);
            expect(store.dispatch).toHaveBeenCalled();
        });
    });

    describe('openPreviewDialog method', () => {
        it('should fire a redux action', () => {
            instance.openPreviewDialog(provider);
            expect(store.dispatch).toHaveBeenCalled();
        });
    });

    describe('search method', () => {
        it('should fire a redux action', () => {
            instance.search();
            expect(store.dispatch).toHaveBeenCalled();
        });
        it('should reset the page number to 1', () => {
            instance.search('foo');
            expect(instance.page).toBe(1);
        });
    });

    describe('edit method', () => {
        it('should route to the edit page', () => {
            spyOn(router, 'navigate');
            instance.edit(provider);
            expect(router.navigate).toHaveBeenCalledWith(['provider', provider.id, 'edit']);
        });
        it('should route to the wizard page', () => {
            spyOn(router, 'navigate');
            instance.edit(draft);
            expect(router.navigate).toHaveBeenCalledWith(['provider', draft.entityId, 'wizard']);
        });
    });

    describe('deleteProvider method', () => {
        it('should call the modal service', () => {
            spyOn(modal, 'open').and.callFake(() => {
                return {
                    result: Promise.resolve(true)
                };
            });
            instance.deleteProvider(provider);
            expect(modal.open).toHaveBeenCalled();
        });
        it('should log an error to the console on failure', () => {
            spyOn(modal, 'open').and.callFake(() => {
                return {
                    result: Promise.reject(false)
                };
            });
            instance.deleteProvider(provider);
            expect(modal.open).toHaveBeenCalled();
        });
    });
});

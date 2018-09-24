import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap/pagination/pagination.module';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap/modal/modal.module';
import * as fromDashboard from '../reducer';
import { ProviderSearchComponent } from '../component/provider-search.component';
import { EntityItemComponent } from '../component/entity-item.component';
import { DeleteDialogComponent } from '../component/delete-dialog.component';
import { RouterStub } from '../../../../testing/router.stub';
import { NgbModalStub } from '../../../../testing/modal.stub';
import { FileBackedHttpMetadataResolver } from '../../domain/entity';
import { DashboardResolversListComponent } from './dashboard-resolvers-list.component';
import { ResolverItemComponent } from '../component/resolver-item.component';
import { MockI18nModule } from '../../../../testing/i18n.stub';


describe('Dashboard Resolvers List Page', () => {
    let fixture: ComponentFixture<DashboardResolversListComponent>;
    let store: Store<fromDashboard.DashboardState>;
    let router: Router;
    let modal: NgbModal;
    let instance: DashboardResolversListComponent;

    let draft = new FileBackedHttpMetadataResolver({
            entityId: 'foo',
            serviceProviderName: 'bar'
        }),
        resolver = new FileBackedHttpMetadataResolver({
            entityId: 'foo',
            serviceProviderName: 'foo',
            id: '1'
        });

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: Router, useClass: RouterStub },
                { provide: NgbModal, useClass: NgbModalStub }
            ],
            imports: [
                NoopAnimationsModule,
                StoreModule.forRoot({
                    manager: combineReducers(fromDashboard.reducers),
                }),
                ReactiveFormsModule,
                NgbPaginationModule,
                NgbModalModule,
                MockI18nModule
            ],
            declarations: [
                DashboardResolversListComponent,
                ProviderSearchComponent,
                ResolverItemComponent,
                DeleteDialogComponent
            ],
        });

        fixture = TestBed.createComponent(DashboardResolversListComponent);
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

    xdescribe('getPagedResolvers method', () => {});

    describe('changePage method', () => {
        it('should update the page value', () => {
            let page = 2;
            instance.changePage(page);
            expect(instance.page).toBe(page);
        });

        it('should update the paged resolvers list', () => {
            let page = 2;
            spyOn(instance, 'getPagedResolvers');
            instance.changePage(page);
            expect(instance.getPagedResolvers).toHaveBeenCalled();
        });
    });

    describe('toggleResolver method', () => {
        it('should fire a redux action', () => {
            instance.toggleEntity(draft);
            expect(store.dispatch).toHaveBeenCalled();
        });
    });

    describe('openPreviewDialog method', () => {
        it('should fire a redux action', () => {
            instance.openPreviewDialog(resolver);
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
            instance.edit(resolver);
            expect(router.navigate).toHaveBeenCalledWith(['metadata', 'resolver', resolver.id, 'edit']);
        });
        it('should route to the wizard page', () => {
            spyOn(router, 'navigate');
            instance.edit(draft);
            expect(router.navigate).toHaveBeenCalledWith(['metadata', 'resolver', draft.entityId, 'wizard']);
        });
    });

    describe('deleteResolver method', () => {
        it('should call the modal service', () => {
            spyOn(modal, 'open').and.callFake(() => {
                return {
                    result: Promise.resolve(true)
                };
            });
            instance.deleteResolver(resolver);
            expect(modal.open).toHaveBeenCalled();
        });
        it('should log an error to the console on failure', () => {
            spyOn(modal, 'open').and.callFake(() => {
                return {
                    result: Promise.reject(false)
                };
            });
            instance.deleteResolver(resolver);
            expect(modal.open).toHaveBeenCalled();
        });
    });
});

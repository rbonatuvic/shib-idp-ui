import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap/pagination/pagination.module';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap/modal/modal.module';
import * as fromDashboard from '../reducer';
import { ProviderSearchComponent } from '../component/provider-search.component';
import { DeleteDialogComponent } from '../component/delete-dialog.component';
import { RouterStub } from '../../../../testing/router.stub';
import { NgbModalStub } from '../../../../testing/modal.stub';
import { DashboardProvidersListComponent } from './dashboard-providers-list.component';
import { MetadataProvider } from '../../domain/model';
import { ProviderItemComponent } from '../component/provider-item.component';
import { FileBackedHttpMetadataResolver } from '../../domain/entity';


describe('Dashboard Providers List Page', () => {
    let fixture: ComponentFixture<DashboardProvidersListComponent>;
    let store: Store<fromDashboard.DashboardState>;
    let router: Router;
    let modal: NgbModal;
    let instance: DashboardProvidersListComponent;

    let provider = <MetadataProvider>{
            resourceId: 'foo',
            name: 'bar'
        };

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
                NgbModalModule
            ],
            declarations: [
                DashboardProvidersListComponent,
                ProviderSearchComponent,
                ProviderItemComponent,
                DeleteDialogComponent
            ],
        });

        fixture = TestBed.createComponent(DashboardProvidersListComponent);
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

    describe('toggleProvider method', () => {
        it('should fire a redux action', () => {
            instance.toggleEntity(provider);
            expect(store.dispatch).toHaveBeenCalled();
        });
    });

    describe('edit method', () => {
        it('should route to the edit page', () => {
            spyOn(router, 'navigate');
            instance.edit(provider);
            expect(router.navigate).toHaveBeenCalledWith(['metadata', 'provider', provider.resourceId, 'edit']);
        });
    });
});

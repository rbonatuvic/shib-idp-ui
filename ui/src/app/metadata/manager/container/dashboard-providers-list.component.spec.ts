import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { NgbPaginationModule, NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import * as fromDashboard from '../reducer';
import { ProviderSearchComponent } from '../component/provider-search.component';
import { DeleteDialogComponent } from '../component/delete-dialog.component';
import { RouterStub } from '../../../../testing/router.stub';
import { NgbModalStub } from '../../../../testing/modal.stub';
import { DashboardProvidersListComponent } from './dashboard-providers-list.component';
import { MetadataProvider } from '../../domain/model';
import { ProviderItemComponent } from '../component/provider-item.component';
import { MockI18nModule } from '../../../../testing/i18n.stub';
import { CustomDatePipe } from '../../../shared/pipe/date.pipe';
import { of } from 'rxjs';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';


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

    let dispatchSpy, selectSpy;

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
                MockI18nModule,
                InfiniteScrollModule,
                RouterModule
            ],
            declarations: [
                DashboardProvidersListComponent,
                ProviderSearchComponent,
                ProviderItemComponent,
                DeleteDialogComponent,
                CustomDatePipe
            ],
        });

        fixture = TestBed.createComponent(DashboardProvidersListComponent);
        instance = fixture.componentInstance;
        store = TestBed.get(Store);
        router = TestBed.get(Router);
        modal = TestBed.get(NgbModal);

        dispatchSpy = spyOn(store, 'dispatch').and.callThrough();
        selectSpy = spyOn(store, 'select').and.returnValues(of([]), of({'foo': true}));
    });

    it('should compile', () => {
        fixture.detectChanges();

        expect(fixture).toBeDefined();
    });

    describe('search method', () => {
        it('should default to an empty string', () => {
            instance.search();
            expect(store.dispatch).toHaveBeenCalled();
            const action = dispatchSpy.calls.mostRecent().args[0];
            expect(action.payload.query).toBe('');
        });

        it('should search with the provided query string', () => {
            instance.search('foo');
            expect(store.dispatch).toHaveBeenCalled();
            const action = dispatchSpy.calls.mostRecent().args[0];
            expect(action.payload.query).toBe('foo');
        });
    });

    describe('edit method', () => {
        it('should route to the edit page', () => {
            const evt = new Event('a type');
            spyOn(router, 'navigate');
            spyOn(evt, 'preventDefault');
            instance.edit(provider, evt);
            expect(evt.preventDefault).toHaveBeenCalled();
            expect(router.navigate).toHaveBeenCalledWith(['metadata', 'provider', provider.resourceId, 'edit']);
        });
    });

    describe('loadMore method', () => {
        it('should call the page observable to emit the next value', (done: DoneFn) => {
            instance.loadMore(5);
            instance.page$.subscribe(val => {
                expect(val).toBe(5);
                expect(instance.page).toBe(5);
                done();
            });
        });
    });

    describe('onScroll method', () => {
        it('should call the loadMore method', () => {
            spyOn(instance, 'loadMore');
            instance.onScroll(new Event('scrolled'));
            expect(instance.loadMore).toHaveBeenCalledWith(instance.page + 1);
        });
    });
});

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { SearchDialogComponent } from './search-dialog.component';
import { NgbActiveModalStub } from '../../../../testing/modal.stub';
import * as fromFilter from '../reducer';
import { SharedModule } from '../../../shared/shared.module';

describe('Search Dialog', () => {
    let fixture: ComponentFixture<SearchDialogComponent>;
    let store: Store<fromFilter.State>;
    let instance: SearchDialogComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: NgbActiveModal, useClass: NgbActiveModalStub }
            ],
            imports: [
                ReactiveFormsModule,
                NgbModalModule,
                StoreModule.forRoot({
                    'metadata-filter': combineReducers(fromFilter.reducers),
                }),
                SharedModule
            ],
            declarations: [
                SearchDialogComponent
            ],
        });

        fixture = TestBed.createComponent(SearchDialogComponent);
        instance = fixture.componentInstance;

        store = TestBed.get(Store);

        spyOn(store, 'dispatch').and.callThrough();
    });

    it('should compile', () => {
        fixture.detectChanges();

        expect(fixture).toBeDefined();
    });

    describe('search method', () => {
        it('should dispatch a search action', () => {
            fixture.detectChanges();
            instance.search('foo');
            expect(store.dispatch).toHaveBeenCalled();
        });

        it('should dispatch a search action with the default string if not provided', () => {
            fixture.detectChanges();
            instance.search();
            expect(store.dispatch).toHaveBeenCalled();
        });
    });
});

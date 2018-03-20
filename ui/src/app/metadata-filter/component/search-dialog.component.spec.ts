import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NgbModalModule, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { SearchDialogComponent } from './search-dialog.component';
import { NgbActiveModalStub } from '../../../testing/modal.stub';
import * as fromFilter from '../reducer';

describe('Search Dialog', () => {
    let fixture: ComponentFixture<SearchDialogComponent>;
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
            ],
            declarations: [
                SearchDialogComponent
            ],
        });

        fixture = TestBed.createComponent(SearchDialogComponent);
        instance = fixture.componentInstance;
    });

    it('should compile', () => {
        fixture.detectChanges();

        expect(fixture).toBeDefined();
    });
});

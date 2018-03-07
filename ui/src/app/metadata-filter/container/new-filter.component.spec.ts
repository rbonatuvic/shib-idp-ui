import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { NewFilterComponent } from './new-filter.component';
import * as fromFilter from '../reducer';

describe('New Metadata Filter Page', () => {
    let fixture: ComponentFixture<NewFilterComponent>;
    let store: Store<fromFilter.State>;
    let instance: NewFilterComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [],
            imports: [
                StoreModule.forRoot({
                    providers: combineReducers(fromFilter.reducers),
                }),
                ReactiveFormsModule
            ],
            declarations: [NewFilterComponent],
        });

        fixture = TestBed.createComponent(NewFilterComponent);
        instance = fixture.componentInstance;
        store = TestBed.get(Store);

        spyOn(store, 'dispatch').and.callThrough();
    });

    it('should compile', () => {
        fixture.detectChanges();

        expect(fixture).toBeDefined();
    });
});

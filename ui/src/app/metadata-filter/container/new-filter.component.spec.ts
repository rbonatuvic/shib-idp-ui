import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { NewFilterComponent } from './new-filter.component';
import * as fromFilter from '../reducer';
import { ProviderEditorFormModule } from '../../metadata-provider/component';
import { ProviderStatusEmitter, ProviderValueEmitter } from '../../metadata-provider/service/provider-change-emitter.service';

describe('New Metadata Filter Page', () => {
    let fixture: ComponentFixture<NewFilterComponent>;
    let store: Store<fromFilter.State>;
    let instance: NewFilterComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ProviderStatusEmitter,
                ProviderValueEmitter,
                FormBuilder
            ],
            imports: [
                StoreModule.forRoot({
                    providers: combineReducers(fromFilter.reducers),
                }),
                ReactiveFormsModule,
                ProviderEditorFormModule
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

    describe('cancel method', () => {
        it('should dispatch a cancel changes action', () => {
            fixture.detectChanges();
            instance.cancel();
            expect(store.dispatch).toHaveBeenCalled();
        });
    });
});

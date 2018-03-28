import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { NewFilterComponent } from './new-filter.component';
import * as fromFilter from '../reducer';
import { ProviderEditorFormModule } from '../../metadata-provider/component';
import { ProviderStatusEmitter, ProviderValueEmitter } from '../../metadata-provider/service/provider-change-emitter.service';
import { NgbPopoverModule, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { NavigatorService } from '../../core/service/navigator.service';
import { SharedModule } from '../../shared/shared.module';

describe('New Metadata Filter Page', () => {
    let fixture: ComponentFixture<NewFilterComponent>;
    let store: Store<fromFilter.State>;
    let instance: NewFilterComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ProviderStatusEmitter,
                ProviderValueEmitter,
                FormBuilder,
                NgbPopoverConfig,
                NavigatorService
            ],
            imports: [
                StoreModule.forRoot({
                    'metadata-filter': combineReducers(fromFilter.reducers),
                }),
                ReactiveFormsModule,
                ProviderEditorFormModule,
                NgbPopoverModule,
                SharedModule
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

    describe('searchEntityIds method', () => {
        it('should NOT dispatch a loadEntityIds action until there are 4 or more characters', () => {
            fixture.detectChanges();
            instance.searchEntityIds('foo');
            expect(store.dispatch).not.toHaveBeenCalled();
        });

        it('should dispatch a loadEntityIds action', () => {
            fixture.detectChanges();
            instance.searchEntityIds('foo-');
            expect(store.dispatch).toHaveBeenCalled();
        });
    });

    describe('onViewMore method', () => {
        it('should dispatch a viewMoreEntityIds action', () => {
            fixture.detectChanges();
            instance.onViewMore('foo');
            expect(store.dispatch).toHaveBeenCalled();
        });
    });
});

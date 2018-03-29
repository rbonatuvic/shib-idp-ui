import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { FilterFormComponent } from './filter-form.component';
import * as fromFilter from '../reducer';
import { ProviderEditorFormModule } from '../../metadata-provider/component';
import { ProviderStatusEmitter, ProviderValueEmitter } from '../../metadata-provider/service/provider-change-emitter.service';
import { NgbPopoverModule, NgbPopoverConfig, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NavigatorService } from '../../core/service/navigator.service';
import { SharedModule } from '../../shared/shared.module';

describe('Metadata Filter Form Component', () => {
    let fixture: ComponentFixture<FilterFormComponent>;
    let store: Store<fromFilter.State>;
    let instance: FilterFormComponent;

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
                NgbModalModule,
                SharedModule
            ],
            declarations: [FilterFormComponent],
        });

        fixture = TestBed.createComponent(FilterFormComponent);
        instance = fixture.componentInstance;
        store = TestBed.get(Store);

        spyOn(store, 'dispatch').and.callThrough();
    });

    it('should compile', () => {
        fixture.detectChanges();

        expect(fixture).toBeDefined();
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

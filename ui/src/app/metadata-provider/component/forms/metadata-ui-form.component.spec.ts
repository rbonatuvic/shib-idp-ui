import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { ProviderValueEmitter, ProviderStatusEmitter } from '../../service/provider-change-emitter.service';
import * as fromProviders from '../../reducer';
import { NgbPopoverModule, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap/popover/popover.module';
import { ListValuesService } from '../../service/list-values.service';
import { EntityDescriptor } from '../../model/entity-descriptor';
import { MetadataUiFormComponent } from './metadata-ui-form.component';

describe('Metadata UI Form Component', () => {
    let fixture: ComponentFixture<MetadataUiFormComponent>;
    let instance: MetadataUiFormComponent;
    let store: Store<fromProviders.ProviderState>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ProviderValueEmitter,
                ProviderStatusEmitter,
                NgbPopoverConfig,
                ListValuesService
            ],
            imports: [
                NoopAnimationsModule,
                ReactiveFormsModule,
                StoreModule.forRoot({
                    'providers': combineReducers(fromProviders.reducers),
                }),
                NgbPopoverModule
            ],
            declarations: [
                MetadataUiFormComponent
            ],
        });
        store = TestBed.get(Store);
        spyOn(store, 'dispatch').and.callThrough();

        fixture = TestBed.createComponent(MetadataUiFormComponent);
        instance = fixture.componentInstance;
        instance.provider = new EntityDescriptor({ entityId: 'foo', serviceProviderName: 'bar' });
        fixture.detectChanges();
    });

    it('should compile', () => {
        expect(fixture).toBeDefined();
    });
});

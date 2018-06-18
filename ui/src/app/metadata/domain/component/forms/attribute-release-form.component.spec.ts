import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { ProviderValueEmitter, ProviderStatusEmitter } from '../../../domain/service/provider-change-emitter.service';
import * as fromMetadata from '../../../metadata.reducer';
import { NgbPopoverModule, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap/popover/popover.module';
import { AttributeReleaseFormComponent } from './attribute-release-form.component';
import { ListValuesService } from '../../../domain/service/list-values.service';
import * as stubs from '../../../../../testing/resolver.stub';

describe('Attribute Release Form Component', () => {
    let fixture: ComponentFixture<AttributeReleaseFormComponent>;
    let instance: AttributeReleaseFormComponent;
    let store: Store<fromMetadata.State>;

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
                    'metadata': combineReducers(fromMetadata.reducers),
                }),
                NgbPopoverModule
            ],
            declarations: [
                AttributeReleaseFormComponent
            ],
        });
        store = TestBed.get(Store);
        spyOn(store, 'dispatch').and.callThrough();

        fixture = TestBed.createComponent(AttributeReleaseFormComponent);
        instance = fixture.componentInstance;
        instance.resolver = {
            ...stubs.resolver,
            attributeRelease: []
        };
        fixture.detectChanges();
    });

    it('should compile', () => {
        expect(fixture).toBeDefined();
    });

    describe('ngOnChanges method', () => {
        it('should set properties on the provider', () => {
            spyOn(instance, 'setAttributes');
            instance.ngOnChanges();
            expect(instance.resolver.attributeRelease).toEqual([]);
            expect(instance.setAttributes).toHaveBeenCalled();
        });
    });

    describe('onCheck method', () => {
        it('should add the attribute to the list if checked', () => {
            instance.onCheck({ target: { checked: true } }, 'foo');
            expect(instance.attributeRelease.length).toBe(1);
        });
        it('should remove the attribute if not checked', () => {
            spyOn(instance.attributeRelease, 'removeAt').and.callThrough();
            instance.onCheck({ target: { checked: false } }, 'foo');
            expect(instance.attributeRelease.removeAt).toHaveBeenCalled();
        });
    });
});

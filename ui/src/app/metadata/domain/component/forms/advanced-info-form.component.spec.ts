import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { ProviderValueEmitter, ProviderStatusEmitter } from '../../../domain/service/provider-change-emitter.service';
import * as fromMetadata from '../../../metadata.reducer';
import { AdvancedInfoFormComponent } from './advanced-info-form.component';
import { NgbPopoverModule, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap/popover/popover.module';
import * as stubs from '../../../../../testing/resolver.stub';

describe('Advanced Info Form Component', () => {
    let fixture: ComponentFixture<AdvancedInfoFormComponent>;
    let instance: AdvancedInfoFormComponent;
    let store: Store<fromMetadata.MetadataState>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ProviderValueEmitter,
                ProviderStatusEmitter,
                NgbPopoverConfig
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
                AdvancedInfoFormComponent
            ],
        });
        store = TestBed.get(Store);
        spyOn(store, 'dispatch').and.callThrough();

        fixture = TestBed.createComponent(AdvancedInfoFormComponent);
        instance = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should compile', () => {
        expect(fixture).toBeDefined();
    });

    describe('ngOnChanges method', () => {
        it('should set properties on the resolver', () => {
            instance.resolver = stubs.resolver;
            fixture.detectChanges();
            instance.ngOnChanges();
            expect(instance.resolver.organization).toEqual({});
            expect(instance.resolver.contacts).toEqual([]);
        });
    });

    describe('removeContact method', () => {
        it('should remove the contact at the given index', () => {
            instance.resolver = {
                ...stubs.resolver,
                contacts: [stubs.contact]
            };
            fixture.detectChanges();
            instance.ngOnChanges();
            instance.removeContact(0);
            expect(instance.contacts.length).toBe(0);
        });
    });

    describe('addContact method', () => {
        it('should remove the contact at the given index', () => {
            instance.resolver = {
                ...stubs.resolver,
                contacts: [stubs.contact]
            };
            fixture.detectChanges();
            instance.ngOnChanges();
            instance.addContact();
            expect(instance.contacts.length).toBe(2);
        });
    });
});

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { ProviderValueEmitter, ProviderStatusEmitter } from '../../../domain/service/provider-change-emitter.service';
import { NgbPopoverModule, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap/popover/popover.module';
import { ListValuesService } from '../../../domain/service/list-values.service';
import { OrganizationInfoFormComponent } from './organization-info-form.component';
import * as stubs from '../../../../../testing/resolver.stub';
import * as fromMetadata from '../../../metadata.reducer';

describe('Organization Info Form Component', () => {
    let fixture: ComponentFixture<OrganizationInfoFormComponent>;
    let instance: OrganizationInfoFormComponent;
    let store: Store<fromMetadata.MetadataState>;

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
                OrganizationInfoFormComponent
            ],
        });
        store = TestBed.get(Store);
        spyOn(store, 'dispatch').and.callThrough();

        fixture = TestBed.createComponent(OrganizationInfoFormComponent);
        instance = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should compile', () => {
        expect(fixture).toBeDefined();
    });

    describe('ngOnChanges method', () => {
        it('should set properties on the provider', () => {
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

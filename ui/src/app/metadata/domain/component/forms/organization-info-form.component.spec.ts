import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { ProviderValueEmitter, ProviderStatusEmitter } from '../../../domain/service/provider-change-emitter.service';
import * as fromCollections from '../../../domain/reducer';
import { NgbPopoverModule, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap/popover/popover.module';
import { ListValuesService } from '../../../domain/service/list-values.service';
import { OrganizationInfoFormComponent } from './organization-info-form.component';
import * as stubs from '../../../../testing/provider.stub';

describe('Organization Info Form Component', () => {
    let fixture: ComponentFixture<OrganizationInfoFormComponent>;
    let instance: OrganizationInfoFormComponent;
    let store: Store<fromCollections.CollectionState>;

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
                    'collections': combineReducers(fromCollections.reducers),
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
            instance.provider = stubs.provider;
            fixture.detectChanges();
            instance.ngOnChanges();
            expect(instance.provider.organization).toEqual({});
            expect(instance.provider.contacts).toEqual([]);
        });
    });

    describe('removeContact method', () => {
        it('should remove the contact at the given index', () => {
            instance.provider = {
                ...stubs.provider,
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
            instance.provider = {
                ...stubs.provider,
                contacts: [stubs.contact]
            };
            fixture.detectChanges();
            instance.ngOnChanges();
            instance.addContact();
            expect(instance.contacts.length).toBe(2);
        });
    });
});

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { ProviderValueEmitter, ProviderStatusEmitter } from '../../../domain/service/provider-change-emitter.service';
import * as fromProviders from '../../reducer';
import { NgbPopoverModule, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap/popover/popover.module';
import { AssertionFormComponent } from './assertion-form.component';
import * as stubs from '../../../../testing/provider.stub';

describe('Assertion Form Component', () => {
    let fixture: ComponentFixture<AssertionFormComponent>;
    let instance: AssertionFormComponent;
    let store: Store<fromProviders.ProviderState>;

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
                    'providers': combineReducers(fromProviders.reducers),
                }),
                NgbPopoverModule
            ],
            declarations: [
                AssertionFormComponent
            ],
        });
        store = TestBed.get(Store);
        spyOn(store, 'dispatch').and.callThrough();

        fixture = TestBed.createComponent(AssertionFormComponent);
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
            expect(instance.provider.assertionConsumerServices).toEqual([]);
        });
    });

    describe('removeEndpoint method', () => {
        it('should remove the endpoint at the given index', () => {
            instance.provider = {
                ...stubs.provider,
                assertionConsumerServices: [stubs.endpoint]
            };
            fixture.detectChanges();
            instance.ngOnChanges();
            instance.removeEndpoint(0);
            expect(instance.assertionConsumerServices.length).toBe(0);
        });
    });

    describe('addEndpoint method', () => {
        it('should remove the endpoint at the given index', () => {
            instance.provider = {
                ...stubs.provider,
                assertionConsumerServices: [stubs.endpoint]
            };
            fixture.detectChanges();
            instance.ngOnChanges();
            instance.addEndpoint();
            expect(instance.assertionConsumerServices.length).toBe(2);
        });
    });
});

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ProviderValueEmitter, ProviderStatusEmitter } from '../../../domain/service/provider-change-emitter.service';
import { NgbPopoverModule, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { AssertionFormComponent } from './assertion-form.component';
import * as stubs from '../../../../../testing/resolver.stub';
import { MockI18nModule } from '../../../../../testing/i18n.stub';
import { MockSharedModule } from '../../../../../testing/shared.stub';

describe('Assertion Form Component', () => {
    let fixture: ComponentFixture<AssertionFormComponent>;
    let instance: AssertionFormComponent;

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
                MockSharedModule,
                MockI18nModule
            ],
            declarations: [
                AssertionFormComponent
            ],
        });

        fixture = TestBed.createComponent(AssertionFormComponent);
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
            expect(instance.resolver.assertionConsumerServices).toEqual([]);
        });
    });

    describe('removeEndpoint method', () => {
        it('should remove the endpoint at the given index', () => {
            instance.resolver = {
                ...stubs.resolver,
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
            instance.resolver = {
                ...stubs.resolver,
                assertionConsumerServices: [stubs.endpoint]
            };
            fixture.detectChanges();
            instance.ngOnChanges();
            instance.addEndpoint();
            expect(instance.assertionConsumerServices.length).toBe(2);
        });
    });
});

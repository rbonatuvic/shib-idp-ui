import { Component, ViewChild } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { ProviderValueEmitter, ProviderStatusEmitter } from '../../service/provider-change-emitter.service';
import * as fromProviders from '../../reducer';
import { NgbPopoverModule, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap/popover/popover.module';
import { ListValuesService } from '../../service/list-values.service';
import { EntityDescriptor } from '../../model/entity-descriptor';
import { KeyInfoFormComponent } from './key-info-form.component';
import { InputDefaultsDirective } from '../../directive/input-defaults.directive';

import * as stubs from '../../../../testing/provider.stub';

@Component({
    template: `<key-info-form [provider]="provider"></key-info-form>`
})
class TestHostComponent {
    provider = new EntityDescriptor({
        ...stubs.provider,
        securityInfo: {
            ...stubs.secInfo,
            x509Certificates: []
        }
    });

    @ViewChild(KeyInfoFormComponent)
    public formUnderTest: KeyInfoFormComponent;

    changeProvider(opts: any): void {
        this.provider = Object.assign({}, this.provider, opts);
    }
}

describe('Security (Key) Info Form Component', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let store: Store<fromProviders.ProviderState>;
    let form: KeyInfoFormComponent;

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
                KeyInfoFormComponent,
                TestHostComponent,
                InputDefaultsDirective
            ],
        }).compileComponents();
        store = TestBed.get(Store);
        spyOn(store, 'dispatch').and.callThrough();

        fixture = TestBed.createComponent(TestHostComponent);
        instance = fixture.componentInstance;
        form = instance.formUnderTest;
        fixture.detectChanges();
    });

    it('should compile', () => {
        expect(fixture).toBeDefined();
    });

    describe('removeCert method', () => {
        it('should remove the certificate at the given index', () => {
            instance.changeProvider({
                securityInfo: {
                    ...stubs.secInfo,
                    x509CertificateAvailable: true,
                    x509Certificates: [stubs.certificate]
                }
            });
            fixture.detectChanges();
            form.removeCert(0);
            fixture.detectChanges();
            expect(form.x509Certificates.length).toBe(0);
        });
    });

    describe('addCert method', () => {
        it('should remove the certificate at the given index', () => {
            instance.changeProvider({
                securityInfo: {
                    ...stubs.secInfo,
                    x509CertificateAvailable: true
                }
            });
            fixture.detectChanges();
            form.addCert();
            fixture.detectChanges();
            expect(form.x509Certificates.length).toBe(1);
        });
    });

    describe('ngOnInit method', () => {
        it('should remove certificates if there are none available', () => {
            instance.changeProvider({
                securityInfo: {
                    ...stubs.secInfo,
                    x509Certificates: [stubs.certificate]
                }
            });
            fixture.detectChanges();
            expect(form.x509Certificates.length).toBe(0);
        });
    });
});

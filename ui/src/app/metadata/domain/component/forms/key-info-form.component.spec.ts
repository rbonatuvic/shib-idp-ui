import { Component, ViewChild } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ProviderValueEmitter, ProviderStatusEmitter } from '../../../domain/service/provider-change-emitter.service';
import { NgbPopoverModule, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { ListValuesService } from '../../../domain/service/list-values.service';
import { KeyInfoFormComponent } from './key-info-form.component';

import * as stubs from '../../../../../testing/resolver.stub';
import { FileBackedHttpMetadataResolver } from '../../entity';
import { InputDefaultsDirective } from '../../../../shared/directive/input-defaults.directive';
import { MockI18nModule } from '../../../../../testing/i18n.stub';
import { MockListValueService } from '../../../../../testing/list-values.stub';
import { MockSharedModule } from '../../../../../testing/shared.stub';

@Component({
    template: `<key-info-form [resolver]="resolver"></key-info-form>`
})
class TestHostComponent {
    resolver = new FileBackedHttpMetadataResolver({
        ...stubs.resolver,
        securityInfo: {
            ...stubs.secInfo,
            x509Certificates: []
        }
    });

    @ViewChild(KeyInfoFormComponent)
    public formUnderTest: KeyInfoFormComponent;

    changeProvider(opts: any): void {
        this.resolver = Object.assign({}, this.resolver, opts);
    }
}

describe('Security (Key) Info Form Component', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let form: KeyInfoFormComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ProviderValueEmitter,
                ProviderStatusEmitter,
                NgbPopoverConfig,
                { provide: ListValuesService, useClass: MockListValueService }
            ],
            imports: [
                NoopAnimationsModule,
                ReactiveFormsModule,
                MockSharedModule,
                MockI18nModule
            ],
            declarations: [
                KeyInfoFormComponent,
                TestHostComponent,
                InputDefaultsDirective
            ],
        }).compileComponents();

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

    describe('createGroup method', () => {
        it('should return a FormGroup with the correct attributes', () => {
            let group = form.createGroup();
            expect(Object.keys(group.controls)).toEqual(['name', 'type', 'value']);
        });

        it('should return a FormGroup with the provided attributes', () => {
            let group = form.createGroup({
                name: 'foo',
                type: 'signing',
                value: 'bar'
            });
            let controls = group.controls;
            expect(controls.name.value).toEqual('foo');
            expect(controls.type.value).toEqual('signing');
            expect(controls.value.value).toEqual('bar');
        });
    });
});

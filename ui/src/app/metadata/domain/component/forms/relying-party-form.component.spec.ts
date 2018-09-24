import { Component, ViewChild } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ProviderValueEmitter, ProviderStatusEmitter } from '../../../domain/service/provider-change-emitter.service';
import { NgbPopoverModule, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap/popover/popover.module';
import { ListValuesService } from '../../../domain/service/list-values.service';
import { RelyingPartyFormComponent } from './relying-party-form.component';
import * as stubs from '../../../../../testing/resolver.stub';
import { SharedModule } from '../../../../shared/shared.module';
import { FileBackedHttpMetadataResolver } from '../../entity';
import { MockI18nModule } from '../../../../../testing/i18n.stub';


@Component({
    template: `<relying-party-form [resolver]="resolver"></relying-party-form>`
})
class TestHostComponent {
    resolver = new FileBackedHttpMetadataResolver({
        ...stubs.resolver,
        relyingPartyOverrides: {
            nameIdFormats: [],
            authenticationMethods: []
        }
    });

    @ViewChild(RelyingPartyFormComponent)
    public formUnderTest: RelyingPartyFormComponent;

    changeProvider(opts: any): void {
        this.resolver = Object.assign({}, this.resolver, opts);
    }

    addString(collection: 'nameIdFormats' | 'authenticationMethods', value: string): void {
        this.resolver.relyingPartyOverrides[collection].push(value);
    }
}

describe('Relying Party Form Component', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let form: RelyingPartyFormComponent;
    let fb: FormBuilder;

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
                NgbPopoverModule,
                SharedModule,
                MockI18nModule
            ],
            declarations: [
                RelyingPartyFormComponent,
                TestHostComponent
            ],
        });

        fixture = TestBed.createComponent(TestHostComponent);
        fb = TestBed.get(FormBuilder);
        instance = fixture.componentInstance;
        form = instance.formUnderTest;
        fixture.detectChanges();
    });

    it('should compile', () => {
        expect(fixture).toBeDefined();
    });

    describe('removeFormat method', () => {
        it('should remove the nameid format at the given index', () => {
            instance.addString('nameIdFormats', 'foo');
            fixture.detectChanges();
            form.removeFormat(0);
            fixture.detectChanges();
            expect(form.nameIdFormatList.length).toBe(0);
        });
    });

    describe('addFormat method', () => {
        it('should add a new nameid format', () => {
            form.addFormat();
            fixture.detectChanges();
            expect(form.nameIdFormatList.length).toBe(1);
        });

        it('should add a new nameid format with a value supplied', () => {
            form.addFormat('foo');
            fixture.detectChanges();
            expect(form.nameIdFormatList.length).toBe(1);
        });
    });

    describe('removeAuthenticationMethod method', () => {
        it('should remove the auth method at the given index', () => {
            instance.addString('authenticationMethods', 'foo');
            fixture.detectChanges();
            form.removeAuthenticationMethod(0);
            fixture.detectChanges();
            expect(form.authenticationMethodList.length).toBe(0);
        });
    });

    describe('addAuthenticationMethod method', () => {
        it('should add a new auth method', () => {
            form.addAuthenticationMethod();
            fixture.detectChanges();
            expect(form.authenticationMethodList.length).toBe(1);
        });

        it('should add a new auth method with provided value', () => {
            form.addAuthenticationMethod('foo');
            fixture.detectChanges();
            expect(form.authenticationMethodList.length).toBe(1);
        });
    });

    describe('getRequiredControl method', () => {
        it('should create a form control with the required validator attached', () => {
            spyOn(fb, 'control').and.callThrough();
            form.getRequiredControl('foo');
            expect(fb.control).toHaveBeenCalledWith('foo', Validators.required);
        });
    });
});

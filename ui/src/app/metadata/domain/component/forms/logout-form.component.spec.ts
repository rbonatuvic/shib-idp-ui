import { ViewChild, Component } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { ProviderValueEmitter, ProviderStatusEmitter } from '../../../domain/service/provider-change-emitter.service';
import { NgbPopoverModule, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap/popover/popover.module';
import { ListValuesService } from '../../../domain/service/list-values.service';
import { LogoutFormComponent } from './logout-form.component';

import * as stubs from '../../../../../testing/resolver.stub';
import { FileBackedHttpMetadataResolver } from '../../entity';
import { InputDefaultsDirective } from '../../../../shared/directive/input-defaults.directive';
import { I18nTextComponent } from '../../../../shared/component/i18n-text.component';

@Component({
    template: `<logout-form [resolver]="resolver"></logout-form>`
})
class TestHostComponent {
    resolver = new FileBackedHttpMetadataResolver({
        ...stubs.resolver,
        logoutEndpoints: [stubs.logoutEndpoint]
    });

    @ViewChild(LogoutFormComponent)
    public formUnderTest: LogoutFormComponent;

    changeProvider(opts: any): void {
        this.resolver = Object.assign({}, this.resolver, opts);
    }
}

describe('Logout Endpoints Form Component', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let form: LogoutFormComponent;

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
                NgbPopoverModule
            ],
            declarations: [
                LogoutFormComponent,
                TestHostComponent,
                InputDefaultsDirective,
                I18nTextComponent
            ],
        });

        fixture = TestBed.createComponent(TestHostComponent);
        instance = fixture.componentInstance;
        form = instance.formUnderTest;
        fixture.detectChanges();
    });

    it('should compile', () => {
        expect(fixture).toBeDefined();
    });

    describe('ngOnInit method', () => {
        it('should remove endpoints if there are none available', () => {
            instance.changeProvider({
                logoutEndpoints: []
            });
            fixture.detectChanges();
            expect(form.logoutEndpoints.length).toBe(0);
        });
    });

    describe('ngOnChanges method', () => {
        it('should add endpoints if provided', () => {
            instance.resolver = new FileBackedHttpMetadataResolver({
                ...stubs.resolver
            });
            fixture.detectChanges();
            expect(form.logoutEndpoints.length).toBe(0);
        });
    });

    describe('setEndpoints method', () => {
        it('should add endpoints if provided', () => {
            form.setEndpoints();
            fixture.detectChanges();
            expect(form.form.get('logoutEndpoints')).toBeDefined();
        });
    });

    describe('removeCert method', () => {
        it('should remove the endpoint at the given index', () => {
            instance.changeProvider({
                logoutEndpoints: [stubs.endpoint]
            });
            fixture.detectChanges();
            form.removeEndpoint(0);
            fixture.detectChanges();
            expect(form.logoutEndpoints.length).toBe(0);
        });
    });

    describe('addCert method', () => {
        it('should remove the endpoint at the given index', () => {
            instance.changeProvider({
                logoutEndpoints: []
            });
            fixture.detectChanges();
            form.addEndpoint();
            fixture.detectChanges();
            expect(form.logoutEndpoints.length).toBe(1);
        });
    });

    describe('createGroup method', () => {
        it('should return a FormGroup with the correct attributes', () => {
            let group = form.createGroup();
            expect(Object.keys(group.controls)).toEqual(['url', 'bindingType']);
        });

        it('should return a FormGroup with the provided attributes', () => {
            let group = form.createGroup({
                url: 'foo',
                bindingType: 'bar'
            });
            let controls = group.controls;
            expect(controls.url.value).toEqual('foo');
            expect(controls.bindingType.value).toEqual('bar');
        });
    });
});

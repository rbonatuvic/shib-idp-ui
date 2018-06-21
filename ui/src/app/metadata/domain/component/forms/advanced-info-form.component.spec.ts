import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ViewChild, Component } from '@angular/core';
import { NgbPopoverModule, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap/popover/popover.module';
import { Observable, of } from 'rxjs';
import { ProviderValueEmitter, ProviderStatusEmitter } from '../../../domain/service/provider-change-emitter.service';
import { AdvancedInfoFormComponent } from './advanced-info-form.component';
import * as stubs from '../../../../../testing/resolver.stub';
import { FileBackedHttpMetadataResolver } from '../../entity';

@Component({
    template: `<adv-info-form [resolver]="resolver" [ids]="ids$"></adv-info-form>`
})
class TestHostComponent {

    ids$: Observable<string[]> = of(['foo']);
    resolver = new FileBackedHttpMetadataResolver({
        ...stubs.resolver,
        serviceProviderSsoDescriptor: {
            protocolSupportEnum: 'foo',
            nameIdFormats: []
        }
    });

    @ViewChild(AdvancedInfoFormComponent)
    public formUnderTest: AdvancedInfoFormComponent;

    changeProvider(opts: any): void {
        this.resolver = Object.assign({}, this.resolver, opts);
    }

    addFormat(value: string): void {
        this.resolver.serviceProviderSsoDescriptor.nameIdFormats.push(value);
    }
}


describe('Advanced Info Form Component', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;

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
                NgbPopoverModule
            ],
            declarations: [
                AdvancedInfoFormComponent,
                TestHostComponent
            ],
        });

        fixture = TestBed.createComponent(TestHostComponent);
        instance = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should compile', () => {
        expect(fixture).toBeDefined();
    });

    describe('ngOnChanges method', () => {
        it('should set properties on the resolver', () => {
            instance.changeProvider(stubs.resolver);
            fixture.detectChanges();
            expect(instance.formUnderTest.resolver.organization).toEqual({});
            expect(instance.formUnderTest.resolver.contacts).toEqual([]);
        });
    });

    describe('removeContact method', () => {
        it('should remove the contact at the given index', () => {
            instance.changeProvider({
                ...stubs.resolver,
                contacts: [stubs.contact]
            });
            fixture.detectChanges();
            instance.formUnderTest.removeContact(0);
            expect(instance.formUnderTest.contacts.length).toBe(0);
        });
    });

    describe('addContact method', () => {
        it('should remove the contact at the given index', () => {
            instance.changeProvider({
                ...stubs.resolver,
                contacts: [stubs.contact]
            });
            fixture.detectChanges();
            instance.formUnderTest.addContact();
            expect(instance.formUnderTest.contacts.length).toBe(2);
        });
    });
});

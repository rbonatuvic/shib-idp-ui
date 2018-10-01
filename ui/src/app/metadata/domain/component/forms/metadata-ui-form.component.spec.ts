import { ViewChild, Component, Input } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ProviderValueEmitter, ProviderStatusEmitter } from '../../../domain/service/provider-change-emitter.service';
import { NgbPopoverModule, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { ListValuesService } from '../../../domain/service/list-values.service';
import { MetadataUiFormComponent } from './metadata-ui-form.component';

import * as stubs from '../../../../../testing/resolver.stub';
import { FileBackedHttpMetadataResolver } from '../../entity';
import { InputDefaultsDirective } from '../../../../shared/directive/input-defaults.directive';
import { MockI18nModule } from '../../../../../testing/i18n.stub';
import { MockListValueService } from '../../../../../testing/list-values.stub';
import { MockSharedModule } from '../../../../../testing/shared.stub';

@Component({
    template: `<metadata-ui-form [resolver]="resolver"></metadata-ui-form>`
})
class TestHostComponent {
    resolver = new FileBackedHttpMetadataResolver({
        ...stubs.resolver
    });

    @ViewChild(MetadataUiFormComponent)
    public formUnderTest: MetadataUiFormComponent;

    changeProvider(opts: any): void {
        this.resolver = Object.assign({}, this.resolver, opts);
    }
}

describe('Metadata UI Form Component', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let form: MetadataUiFormComponent;

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
                MetadataUiFormComponent,
                TestHostComponent,
                InputDefaultsDirective
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

    describe('ngOnChanges lifecycle event', () => {
        it('should set the mdui data with a default object when one is not provided', () => {
            spyOn(form.form, 'reset');
            instance.changeProvider({});
            fixture.detectChanges();
            expect(form.form.reset).toHaveBeenCalledWith({mdui: {}});
        });
    });
});

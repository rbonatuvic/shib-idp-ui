import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ProviderItemComponent } from './provider-item.component';
import { ViewChild, Component } from '@angular/core';
import { MetadataProvider } from '../../domain/model';
import { MockI18nModule } from '../../../../testing/i18n.stub';

@Component({
    template: `
        <provider-item
            [provider]="provider"
            [isOpen]="isOpen">
        </provider-item>
    `
})
class TestHostComponent {
    @ViewChild(ProviderItemComponent)
    public componentUnderTest: ProviderItemComponent;

    private _provider;
    private _open;

    public set isOpen(open: boolean) {
        this._open = open;
    }

    public get isOpen(): boolean {
        return this._open;
    }

    public set provider(provider: MetadataProvider) {
        this._provider = provider;
    }

    public get provider(): MetadataProvider {
        return this._provider;
    }
}

describe('Provider List item', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [],
            imports: [
                NoopAnimationsModule,
                MockI18nModule
            ],
            declarations: [
                ProviderItemComponent,
                TestHostComponent
            ],
        });

        fixture = TestBed.createComponent(TestHostComponent);
        instance = fixture.componentInstance;

        instance.provider = <MetadataProvider>{
            resourceId: 'foo',
            metadataFilters: []
        };
    });

    it('should compile', () => {
        fixture.detectChanges();

        expect(fixture).toBeDefined();
    });
});

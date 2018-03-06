import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ProviderItemComponent } from './provider-item.component';
import { MetadataProvider } from '../../metadata-provider/model/metadata-provider';

describe('Provider List item', () => {
    let fixture: ComponentFixture<ProviderItemComponent>;
    let instance: ProviderItemComponent;

    let provider = { entityId: 'foo', serviceProviderName: 'bar' } as MetadataProvider;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [],
            imports: [
                NoopAnimationsModule
            ],
            declarations: [ProviderItemComponent],
        });

        fixture = TestBed.createComponent(ProviderItemComponent);
        instance = fixture.componentInstance;
        instance.provider = provider;
    });

    it('should compile', () => {
        fixture.detectChanges();

        expect(fixture).toBeDefined();
    });
});

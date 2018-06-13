import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EntityItemComponent } from './entity-item.component';
import { MetadataProvider } from '../../domain/model/metadata-provider';

describe('Resolver List item', () => {
    let fixture: ComponentFixture<EntityItemComponent>;
    let instance: EntityItemComponent;

    let provider = { entityId: 'foo', serviceProviderName: 'bar' } as MetadataProvider;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [],
            imports: [
                NoopAnimationsModule
            ],
            declarations: [EntityItemComponent],
        });

        fixture = TestBed.createComponent(EntityItemComponent);
        instance = fixture.componentInstance;
        instance.entity = provider;
    });

    it('should compile', () => {
        fixture.detectChanges();

        expect(fixture).toBeDefined();
    });
});

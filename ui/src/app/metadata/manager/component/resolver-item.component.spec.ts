import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EntityItemComponent } from './entity-item.component';
import { FileBackedHttpMetadataResolver } from '../../domain/entity';
import { ResolverItemComponent } from './resolver-item.component';

describe('Resolver List item', () => {
    let fixture: ComponentFixture<ResolverItemComponent>;
    let instance: ResolverItemComponent;

    let resolver = new FileBackedHttpMetadataResolver({ entityId: 'foo', serviceProviderName: 'bar' });

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [],
            imports: [
                NoopAnimationsModule
            ],
            declarations: [
                ResolverItemComponent
            ],
        });

        fixture = TestBed.createComponent(ResolverItemComponent);
        instance = fixture.componentInstance;
        instance.entity = resolver;
    });

    it('should compile', () => {
        fixture.detectChanges();

        expect(fixture).toBeDefined();
    });
});

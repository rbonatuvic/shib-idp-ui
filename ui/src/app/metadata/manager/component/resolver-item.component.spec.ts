import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EntityItemComponent } from './entity-item.component';
import { FileBackedHttpMetadataResolver } from '../../domain/entity';
import { ResolverItemComponent } from './resolver-item.component';
import { MockI18nModule } from '../../../../testing/i18n.stub';
import { CustomDatePipe } from '../../../shared/pipe/date.pipe';

describe('Resolver List item', () => {
    let fixture: ComponentFixture<ResolverItemComponent>;
    let instance: ResolverItemComponent;

    let resolver = new FileBackedHttpMetadataResolver({ entityId: 'foo', serviceProviderName: 'bar' });

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [],
            imports: [
                NoopAnimationsModule,
                MockI18nModule
            ],
            declarations: [
                ResolverItemComponent,
                CustomDatePipe
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

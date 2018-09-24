import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EntityItemComponent } from './entity-item.component';
import { FileBackedHttpMetadataResolver } from '../../domain/entity';
import { MockI18nModule } from '../../../../testing/i18n.stub';

describe('Resolver List item', () => {
    let fixture: ComponentFixture<EntityItemComponent>;
    let instance: EntityItemComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [],
            imports: [
                NoopAnimationsModule,
                MockI18nModule
            ],
            declarations: [EntityItemComponent],
        });

        fixture = TestBed.createComponent(EntityItemComponent);
        instance = fixture.componentInstance;
    });

    it('should compile', () => {
        fixture.detectChanges();

        expect(fixture).toBeDefined();
    });
});

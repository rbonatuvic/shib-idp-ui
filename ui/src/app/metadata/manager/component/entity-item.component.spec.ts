import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EntityItemComponent } from './entity-item.component';
import { FileBackedHttpMetadataResolver } from '../../domain/entity';

describe('Resolver List item', () => {
    let fixture: ComponentFixture<EntityItemComponent>;
    let instance: EntityItemComponent;

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
    });

    it('should compile', () => {
        fixture.detectChanges();

        expect(fixture).toBeDefined();
    });
});

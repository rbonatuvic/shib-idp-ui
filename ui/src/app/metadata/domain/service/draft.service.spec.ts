import { TestBed } from '@angular/core/testing';
import { EntityDraftService } from './draft.service';
import { FileBackedHttpMetadataResolver } from '../entity';

describe(`EntityDraftService`, () => {
    let service: EntityDraftService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                EntityDraftService
            ]
        });

        service = TestBed.get(EntityDraftService);
    });

    describe('query', () => {
        it(`should return an observable of the list from the store`, (done: DoneFn) => {
            let list = [new FileBackedHttpMetadataResolver()];
            spyOn(service.storage, 'query').and.returnValue(list);
            service.query().subscribe(l => {
                expect(l).toEqual(list);
                done();
            });
        });
    });
    describe('find', () => {
        it(`should return an observable of the list from the store`, (done: DoneFn) => {
            let id = 'foo';
            let e = new FileBackedHttpMetadataResolver({ entityId: id });
            let list = [e];
            spyOn(service.storage, 'query').and.returnValue(list);
            service.find(id).subscribe(entity => {
                expect(entity).toEqual(e);
                done();
            });
        });
    });
});

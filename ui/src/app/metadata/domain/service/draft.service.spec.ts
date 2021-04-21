import { TestBed } from '@angular/core/testing';
import { EntityDraftService } from './draft.service';
import { FileBackedHttpMetadataResolver } from '../entity';
import { MetadataResolver } from '../model';

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
            let e = new FileBackedHttpMetadataResolver({ id: id });
            let list = [e];
            spyOn(service.storage, 'query').and.returnValue(list);
            service.find(id).subscribe(entity => {
                expect(entity).toEqual(e);
                done();
            });
        });

        it(`should return a 404 error if not found`, (done: DoneFn) => {
            let id = null;
            service.find(id).subscribe(null, err => {
                expect(err).toEqual(`404 - null not found in cache.`);
                done();
            });
        });
    });

    describe('exists', () => {
        it('should check if the provided id exists in storage', () => {
            spyOn(service.storage, 'query').and.returnValue([{id: 'bar'} as MetadataResolver]);
            expect(service.exists('foo')).toBe(false);
            expect(service.exists('bar')).toBe(true);
        });

        it('should use the provided attr', () => {
            spyOn(service.storage, 'query').and.returnValue([
                { id: 'bar', serviceProviderName: 'foo' } as MetadataResolver
            ]);
            expect(service.exists('foo', 'serviceProviderName')).toBe(true);
            expect(service.exists('bar', 'serviceProviderName')).toBe(false);
        });
    });

    describe('save', () => {
        it('should add the provider to storage', () => {
            const resolver = { id: 'bar' } as MetadataResolver;
            spyOn(service.storage, 'add');
            service.save(resolver).subscribe();
            expect(service.storage.add).toHaveBeenCalledWith(resolver);
        });
    });

    describe('remove', () => {
        it('should remove the provider from storage', () => {
            const resolver = { id: 'bar' } as MetadataResolver;
            spyOn(service.storage, 'removeByAttr');
            service.remove(resolver).subscribe();
            expect(service.storage.removeByAttr).toHaveBeenCalledWith(resolver.id, 'id');
        });
    });

    describe('update', () => {
        it('should remove the provider from storage', () => {
            const resolver = { id: 'bar' } as MetadataResolver;
            const updates = { id: 'foo', serviceProviderName: 'bar' }; 
            spyOn(service.storage, 'findByAttr').and.returnValue(resolver);
            spyOn(service.storage, 'add');
            spyOn(service.storage, 'removeByAttr');
            service.update(resolver).subscribe();
            expect(service.storage.removeByAttr).toHaveBeenCalled();
            expect(service.storage.add).toHaveBeenCalled();
            expect(service.storage.findByAttr).toHaveBeenCalled();
        });

        it('should return a 404 if not found', () => {
            const resolver = { id: 'bar' } as MetadataResolver;
            spyOn(service.storage, 'findByAttr').and.returnValue(null);
            service.update(resolver).subscribe(null, (err) => {
                expect(err).toBe(`404 - ${resolver.id} not found in cache.`);
                expect(service.storage.findByAttr).toHaveBeenCalled();
            });
        });
    });
});

import { TestBed, async, inject } from '@angular/core/testing';
import { EntityValidators } from './entity-validators.service';
import { Observable, of } from 'rxjs';
import { ListValuesService } from './list-values.service';

describe(`ListValuesService`, () => {
    let service: ListValuesService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                ListValuesService
            ]
        });
        service = TestBed.get(ListValuesService);
    });

    describe(`searchStringList method`, () => {
        it('should match values', (done: DoneFn) => {
            let list = of(['foo', 'bar', 'baz']),
                query = of('foo');
            service.searchStringList(list)(query).subscribe((matches) => {
                expect(matches.length).toBe(1);
                done();
            });
        });
    });

    describe(`searchFormats method`, () => {
        it('should match the nameid formats', (done: DoneFn) => {
            let query = of('unspecified');
            service.searchFormats(query).subscribe((matches) => {
                expect(matches.length).toBe(1);
                done();
            });
        });
    });

    describe(`searchAuthenticationMethods method`, () => {
        it('should match the nameid formats', (done: DoneFn) => {
            let query = of('TimeSyncToken');
            service.searchAuthenticationMethods(query).subscribe((matches) => {
                expect(matches.length).toBe(1);
                done();
            });
        });
    });
});

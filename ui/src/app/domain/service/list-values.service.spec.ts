import { TestBed, async, inject } from '@angular/core/testing';
import { EntityValidators } from './entity-validators.service';
import { Observable } from 'rxjs/Observable';
import { ListValuesService } from './list-values.service';

import 'rxjs/add/observable/of';

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
            let list = Observable.of(['foo', 'bar', 'baz']),
                query = Observable.of('foo');
            service.searchStringList(list)(query).subscribe((matches) => {
                expect(matches.length).toBe(1);
                done();
            });
        });
    });

    describe(`searchFormats method`, () => {
        it('should match the nameid formats', (done: DoneFn) => {
            let query = Observable.of('unspecified');
            service.searchFormats(query).subscribe((matches) => {
                expect(matches.length).toBe(1);
                done();
            });
        });
    });

    describe(`searchAuthenticationMethods method`, () => {
        it('should match the nameid formats', (done: DoneFn) => {
            let query = Observable.of('TimeSyncToken');
            service.searchAuthenticationMethods(query).subscribe((matches) => {
                expect(matches.length).toBe(1);
                done();
            });
        });
    });
});

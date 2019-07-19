import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { MetadataHistoryService } from './history.service';

describe(`Attributes Service`, () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HttpClientTestingModule
            ],
            providers: [
                MetadataHistoryService
            ]
        });
    });

    describe('query method', () => {
        it(`should return a MetadataHistory`, async(inject([MetadataHistoryService, HttpTestingController],
            (service: MetadataHistoryService) => {
                service.query('foo', 'resolver').subscribe(history => {
                    expect(history).toBeDefined();
                });
            }
        )));
    });
});

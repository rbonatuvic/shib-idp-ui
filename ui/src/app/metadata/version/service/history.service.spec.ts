import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { HistoryService } from './history.service';

describe(`Attributes Service`, () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HttpClientTestingModule
            ],
            providers: [
                HistoryService
            ]
        });
    });

    describe('query method', () => {
        it(`should return a MetadataHistory`, async(inject([HistoryService, HttpTestingController],
            (service: HistoryService) => {
                service.query().subscribe(history => {
                    expect(history).toBeDefined();
                });
            }
        )));
    });
});

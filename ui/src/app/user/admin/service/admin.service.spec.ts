import { TestBed, async, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { AdminService } from './admin.service';

describe('Admin Service', () => {
    let service: AdminService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                AdminService
            ]
        });
        service = TestBed.get(AdminService);
    });

    it('should instantiate', () => {
        expect(service).toBeDefined();
    });

    describe('query method', () => {
        it('should return a list of users', () => {
            expect(true).toBe(false);
        });
    });
    describe('update method', () => {
        it('should send an http put request', () => {
            expect(true).toBe(false);
        });
    });
    describe('remove method', () => {
        it('should send an http delete request', () => {
            expect(true).toBe(false);
        });
    });
});

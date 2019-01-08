import { TestBed, async, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { UserService } from './user.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('User Service', () => {
    let service: UserService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                UserService
            ]
        });
        service = TestBed.get(UserService);
    });

    it('should instantiate', () => {
        expect(service).toBeDefined();
    });
});

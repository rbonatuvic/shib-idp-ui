import { TestBed, async, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { UserService } from './user.service';

describe('User Service', () => {
    let service: UserService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
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

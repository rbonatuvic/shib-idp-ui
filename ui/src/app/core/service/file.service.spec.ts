import { TestBed, async, inject } from '@angular/core/testing';
import { FileService } from './file.service';

const getFakeFile = (str: string) => {
    let blob = new Blob([str], { type: 'text/html' });
    blob['lastModifiedDate'] = '';
    blob['name'] = str;
    return <File>blob;
};

describe('File Service', () => {
    let service: FileService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                FileService
            ]
        });
        service = TestBed.get(FileService);
    });

    it('should instantiate', () => {
        expect(service).toBeDefined();
    });

    describe('readAsText method', () => {
        it('should return an observable', () => {
            expect(service.readAsText(getFakeFile('foo'))).toBeDefined();
        });
    });
});

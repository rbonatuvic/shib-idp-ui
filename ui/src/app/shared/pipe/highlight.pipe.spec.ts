import { HighlightPipe } from './highlight.pipe';
import { DomSanitizer } from '@angular/platform-browser';

describe('Pipe: Highlight', () => {
    let pipe: HighlightPipe;

    beforeEach(() => {
        pipe = new HighlightPipe(<DomSanitizer>{
            bypassSecurityTrustHtml: jasmine.createSpy('bypassSecurityTrustHtml'),
            sanitize: jasmine.createSpy('sanitize'),
            bypassSecurityTrustStyle: jasmine.createSpy('bypassSecurityTrustStyle'),
            bypassSecurityTrustScript: jasmine.createSpy('bypassSecurityTrustScript'),
            bypassSecurityTrustUrl: jasmine.createSpy('bypassSecurityTrustUrl'),
            bypassSecurityTrustResourceUrl: jasmine.createSpy('bypassSecurityTrustResourceUrl')
        });
    });

    it('should return the attribute value', () => {
        const str = 'foobar';
        const query = 'foo';
        expect(pipe.transform(str, query)).toBeUndefined();
    });
    it('should return - if the attribute is null', () => {
        expect(pipe.transform(null, null)).toBeNull();
        expect(pipe.transform('foo', null)).toEqual('foo');
        expect(pipe.transform(null, 'foo')).toBeNull();
    });
});

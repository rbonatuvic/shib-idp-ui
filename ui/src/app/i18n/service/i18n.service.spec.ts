import { TestBed, async, inject } from '@angular/core/testing';
import { I18nService } from './i18n.service';
import { HttpClientModule, HttpRequest } from '@angular/common/http';
import { NavigatorService } from '../../core/service/navigator.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

describe('i18n Service', () => {
    let service: I18nService;
    let nav: NavigatorService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HttpClientTestingModule
            ],
            providers: [
                {
                    provide: NavigatorService,
                    useValue: {
                        native: {
                            language: 'en-US',
                            languages: ['en-US', 'zh-CN', 'ja-JP']
                        }
                    }
                },
                I18nService
            ]
        });
        service = TestBed.get(I18nService);
        nav = TestBed.get(NavigatorService);
    });

    it('should instantiate', () => {
        expect(service).toBeDefined();
    });

    describe('get method', () => {
        it(`should send an expected GET request`, async(inject([I18nService, HttpTestingController],
            (i18n: I18nService, backend: HttpTestingController) => {
                const lang = 'en';
                i18n.get(lang).subscribe();

                backend.expectOne((req: HttpRequest<any>) => {
                    return req.url === `${service.base}${service.path}`
                        && req.method === 'GET'
                        && req.params.get('lang') === lang;
                }, `GET attributes by term`);
            }
        )));
    });

    describe('getCurrentLanguage method', () => {
        it('should return the current language', () => {
            expect(service.getCurrentLanguage()).toEqual('en');
        });
    });

    describe('getCurrentLocale method', () => {
        it('should return the current language', () => {
            expect(service.getCurrentLocale()).toEqual('en-US');
        });
    });

    describe('translate method', () => {
        it('should translate the provided message', () => {
            expect(service.translate('foo', { baz: 'baz' }, { foo: 'bar { baz }' })).toEqual('bar baz');
        });

        it('should accept provided messages to check', () => {
            expect(service.translate('foo', null, { baz: 'bar { baz }' })).toEqual('foo');
            expect(service.translate('foo', null, {})).toEqual('');
        });
    });

    describe('interpolate method', () => {
        it('should return provided value if no interpolation strings are passed', () => {
            expect(service.interpolate('foo')).toEqual('foo');
        });
    });
});

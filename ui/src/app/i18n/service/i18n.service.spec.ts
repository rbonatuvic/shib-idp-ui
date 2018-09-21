import { TestBed, async, inject } from '@angular/core/testing';
import { I18nService } from './i18n.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NavigatorService } from '../../core/service/navigator.service';

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
                NavigatorService,
                I18nService
            ]
        });
        service = TestBed.get(I18nService);
        nav = TestBed.get(NavigatorService);
    });

    it('should instantiate', () => {
        expect(service).toBeDefined();
    });

    describe('getCurrentLanguage method', () => {
        it('should return the current language', () => {
            expect(service.getCurrentLanguage()).toEqual('en');
        });
    });

    xdescribe('getCurrentCountry method', () => {
        it('should return the current language', () => {
            expect(service.getCurrentCountry()).toEqual('US');
        });
    });

    describe('getCurrentLocale method', () => {
        it('should return the current language', () => {
            expect(service.getCurrentLocale()).toEqual('en-US');
        });
    });

    describe('translate method', () => {
        it('should translate the provided message', () => {
            expect(service.translate('foo', { baz: 'baz' }, { foo: 'bar { baz }' }));
        });
    });
});

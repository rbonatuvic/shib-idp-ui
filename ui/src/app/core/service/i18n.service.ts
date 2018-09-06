import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NavigatorService } from './navigator.service';
import { getCurrentLanguage, getCurrentCountry, getCurrentLocale } from '../../shared/util';

@Injectable()
export class I18nService {

    readonly path = '/messages';
    readonly base = '/api';

    constructor(
        private http: HttpClient,
        private navigator: NavigatorService
    ) {}

    get(locale: string): Observable<any> {
        let params: HttpParams = new HttpParams();
        params = params.set('lang', locale);
        return this.http.get(`${ this.base }${this.path}`, {
            params
        });
    }

    getCurrentLanguage(): string {
        return getCurrentLanguage(this.navigator.native);
    }

    getCurrentCountry(): string {
        return getCurrentCountry(this.navigator.native);
    }

    getCurrentLocale(): string {
        return getCurrentLocale(this.navigator.native);
    }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NavigatorService } from './navigator.service';
import { getCurrentLanguage } from '../../shared/util';

@Injectable()
export class I18nService {

    readonly path = '/messages';
    readonly base = '/api';

    constructor(
        private http: HttpClient,
        private navigator: NavigatorService
    ) {}

    get(language: string = null): Observable<any> {
        let params: HttpParams = new HttpParams();
        if (!!language) {
            params = params.set('lang', language);
        }
        return this.http.get(`${ this.base }${this.path}`, {
            params
        });
    }

    getCurrentLanguage(): string {
        return getCurrentLanguage(this.navigator.native);
    }
}

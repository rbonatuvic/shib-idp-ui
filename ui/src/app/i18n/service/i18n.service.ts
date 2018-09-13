import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NavigatorService } from '../../core/service/navigator.service';
import { getCurrentLanguage, getCurrentCountry, getCurrentLocale } from '../../shared/util';
import { Messages } from '../model/Messages';

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

    translate(value: string, interpolated: any, messages: Messages): string {
        interpolated = interpolated || {};
        let val = messages.hasOwnProperty(value) ? messages[value] : value;
        console.log(val, messages);
        return this.interpolate(val, interpolated);
    }

    interpolate(value: string, interpolated: { [prop: string]: string } = {}): string {
        return Object.entries(interpolated).reduce((current, interpolate) => {
            let reg = new RegExp(`{\\s*${interpolate[0]}\\s*}`, 'gm');
            return current.replace(reg, interpolate[1]);
        }, value);
    }
}

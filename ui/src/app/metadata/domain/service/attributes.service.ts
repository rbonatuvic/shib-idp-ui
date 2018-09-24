import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, shareReplay, map } from 'rxjs/operators';
import { ReleaseAttribute } from '../model/properties/release-attribute';

const CACHE_SIZE = 1;

@Injectable()
export class AttributesService {

    readonly endpoint = '/customAttributes';
    readonly base = '/api';

    private cache$: Observable<ReleaseAttribute[]>;

    constructor(
        private http: HttpClient
    ) { }

    query(path: string = this.endpoint): Observable<ReleaseAttribute[]> {
        if (!this.cache$) {
            this.cache$ = this.requestAttributes(path).pipe(
                shareReplay(CACHE_SIZE)
            );
        }

        return this.cache$;
    }

    requestAttributes(path: string): Observable<ReleaseAttribute[]> {
        return this.http.get<ReleaseAttribute[]>(`${this.base}${path}`, {})
            .pipe(
                map(attrs => attrs.map((attr: any) => ({ key: attr.name, label: attr.displayName }))),
                catchError(err => throwError([]))
            );
    }
}

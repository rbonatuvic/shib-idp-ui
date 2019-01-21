import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MetadataResolver } from '../model';

@Injectable()
export class ResolverService {

    private endpoint = '/EntityDescriptor';
    private base = '/api';

    constructor(
        private http: HttpClient
    ) {}

    query(opts: any = {}): Observable<MetadataResolver[]> {
        return this.http.get<MetadataResolver[]>(`${ this.base }${ this.endpoint }s`, {})
            .pipe(
                catchError(err => throwError([]))
            );
    }

    find(id: string): Observable<MetadataResolver> {
        return this.http.get<MetadataResolver>(`${ this.base }${ this.endpoint }/${ id }`)
            .pipe(
                catchError(err => throwError(err))
            );
    }

    update(provider: MetadataResolver): Observable<MetadataResolver> {
        return this.http.put<MetadataResolver>(`${this.base}${this.endpoint}/${provider.id}`, provider);
    }

    save(provider: MetadataResolver): Observable<MetadataResolver> {
        const { id, ...p } = provider;
        return this.http.post<MetadataResolver>(`${this.base}${this.endpoint}`, p);
    }

    remove(provider: MetadataResolver): Observable<MetadataResolver> {
        return this.http.delete<MetadataResolver>(`${this.base}${this.endpoint}/${provider.id}`);
    }

    upload(name: string, xml: string): Observable<MetadataResolver> {
        return this.http.post<MetadataResolver>(`${this.base}${this.endpoint}`, xml, {
            headers: new HttpHeaders().set('Content-Type', 'application/xml'),
            params: new HttpParams().set('spName', name)
        }).pipe(catchError(error => {
            return throwError({ errorCode: error.status, errorMessage: `Unable to upload file ... ${error.error.errorMessage}` });
        }));
    }

    createFromUrl(name: string, url: string): Observable<MetadataResolver> {
        let body = `metadataUrl=${url}`;
        return this.http.post<MetadataResolver>(`${this.base}${this.endpoint}`, body, {
            headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
            params: new HttpParams().set('spName', name)
        }).pipe(catchError(error => {
            return throwError({ errorCode: error.status, errorMessage: `Unable to upload file ... ${error.error.errorMessage}` });
        }));
    }

    preview(id: string): Observable<string> {
        return this.http.get(`${this.base}${this.endpoint}/${id}`, {
            headers: new HttpHeaders({
                'Accept': 'application/xml'
            }),
            responseType: 'text'
        });
    }
}

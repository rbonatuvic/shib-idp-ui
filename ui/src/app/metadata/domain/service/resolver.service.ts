import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MetadataResolver } from '../model';
import API_BASE_PATH from '../../../app.constant';

@Injectable()
export class ResolverService {

    private endpoint = '/EntityDescriptor';
    private base = API_BASE_PATH;

    constructor(
        private http: HttpClient
    ) {}

    query(): Observable<MetadataResolver[]> {
        return this.http.get<MetadataResolver[]>(`${ this.base }${ this.endpoint }s`, {});
    }

    queryForAdmin(): Observable<MetadataResolver[]> {
        return this.http.get<MetadataResolver[]>(`${this.base}${this.endpoint}/disabledNonAdmin`, {});
    }

    find(id: string): Observable<MetadataResolver> {
        return this.http.get<MetadataResolver>(`${ this.base }${ this.endpoint }/${ id }`);
    }

    update(provider: MetadataResolver): Observable<MetadataResolver> {
        return this.http.put<MetadataResolver>(`${this.base}${this.endpoint}/${provider.id}`, provider);
    }

    save(provider: MetadataResolver): Observable<MetadataResolver> {
        const { id, ...p } = provider;
        return this.http.post<MetadataResolver>(`${this.base}${this.endpoint}`, p);
    }

    remove(id: string): Observable<MetadataResolver> {
        return this.http.delete<MetadataResolver>(`${this.base}${this.endpoint}/${id}`);
    }

    upload(name: string, xml: string): Observable<MetadataResolver> {
        return this.http.post<MetadataResolver>(`${this.base}${this.endpoint}`, xml, {
            headers: new HttpHeaders().set('Content-Type', 'application/xml'),
            params: new HttpParams().set('spName', name)
        }).pipe(catchError(error => throwError({
            errorCode: error.status,
            errorMessage: `Unable to upload file ... ${error.error.errorMessage}`
        })));
    }

    createFromUrl(name: string, url: string): Observable<MetadataResolver> {
        let body = `metadataUrl=${url}`;
        return this.http.post<MetadataResolver>(`${this.base}${this.endpoint}`, body, {
            headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
            params: new HttpParams().set('spName', name)
        }).pipe(catchError(error => throwError(
            {
                errorCode: error.status,
                errorMessage: `Unable to upload file ... ${error.error.errorMessage}`
            }
        )));
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

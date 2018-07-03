import { Injectable } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class SchemaService {

    constructor(
        private http: HttpClient
    ) { }

    get(path: string): Observable<any> {
        return this.http.get<any>(`${path}`);
    }
}

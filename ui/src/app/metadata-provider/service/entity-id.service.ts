import 'rxjs/add/observable/of';
import 'rxjs/add/operator/concat';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { IDS } from '../../../data/ids.mock';
import { Storage } from '../../shared/storage';
import { environment } from '../../../environments/environment';

const MOCK_INTERVAL = 500;

@Injectable()
export class EntityIdService {

    private endpoint = '/data/ids.json';
    private base = '';

    private subj: Subject<string[]> = new Subject();

    constructor(
        private http: HttpClient
    ) { }

    query(search: string = ''): Observable<string[]> {
        setTimeout(() => {
            let found = IDS.filter((option: string) => option.toLocaleLowerCase().match(search.toLocaleLowerCase()));
            this.subj.next(found);
        }, MOCK_INTERVAL);
        return this.subj.asObservable();
        /*
        return this.http
            .get<string[]>(`${this.base}${this.endpoint}s`)
            .catch(err => {
                console.log('ERROR LOADING IDS:', err);
                return Observable.of([] as string[]);
            });
        */
    }
}

import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { ReleaseAttribute } from '../app/metadata/domain/model/properties/release-attribute';

@Injectable()
export class MockAttributeService {

    readonly path = '/customAttributes';
    readonly base = 'api';

    constructor() { }

    query(path: string = this.path): Observable<ReleaseAttribute[]> {
        return of([]);
    }
}

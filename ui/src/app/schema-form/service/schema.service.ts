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

    isRequired(formProperty: any): boolean {
        let required = false;
        let requiredFields = formProperty.parent.schema.required || [];
        let fieldPath = formProperty.path;
        let controlName = fieldPath.substr(fieldPath.lastIndexOf('/') + 1);
        required = requiredFields.indexOf(controlName) > -1;

        if (!required) {
            const conditions = formProperty.parent.schema.anyOf || [];
            conditions.forEach(el => {
                requiredFields = el.required || [];
                required = !required ? requiredFields.indexOf(controlName) > -1 : required;
            });
        }
        return required;
    }
}

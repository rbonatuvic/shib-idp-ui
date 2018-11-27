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
        if (!formProperty || !formProperty.parent) {
            return false;
        }

        let requiredFields = formProperty.parent.schema.required || [];
        let fieldPath = formProperty.path;
        let controlName = fieldPath.substr(fieldPath.lastIndexOf('/') + 1);
        required = requiredFields.indexOf(controlName) > -1;

        if (!required) {
            const conditions = formProperty.parent.schema.anyOf || [];
            const values = formProperty.parent.value;
            const currentConditions = conditions.filter(condition =>
                Object
                    .keys(condition.properties)
                    .some(
                        key => values.hasOwnProperty(key) ? condition.properties[key].enum[0] === values[key] : false
                    )
            );
            currentConditions.forEach(el => {
                requiredFields = el.required || [];
                required = !required ? requiredFields.indexOf(controlName) > -1 : required;
            });
        }

        if (!required && formProperty.parent instanceof Object) {
            const parent = formProperty.parent;
            const dependencies = parent.schema.dependencies;
            if (dependencies) {
                const isDependencyOf = Object.keys(dependencies).filter(d => {
                    let dep = dependencies[d];
                    return this.getRequiredDependencies(dep);
                });
                const hasActiveDependencies = dependencies.hasOwnProperty(controlName) &&
                    this.getRequiredDependencies(dependencies[controlName]).filter(
                        d => parent.value.hasOwnProperty(d)
                    );
                const isRequired = isDependencyOf.some(d => parent.value.hasOwnProperty(d) && !!parent.value[d]);
                required = isRequired || !!hasActiveDependencies.length;
            }
        }

        return required;
    }

    getRequiredDependencies(dep: any): string[] {
        return (dep instanceof Array) ? dep : dep.hasOwnProperty('required') ? dep.required : [];
    }
}

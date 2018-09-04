import { RouterStateSerializer } from '@ngrx/router-store';
import { RouterStateSnapshot, Params } from '@angular/router';

export interface RouterStateUrl {
    url: string;
    queryParams: Params;
}

export class CustomRouterStateSerializer implements RouterStateSerializer<RouterStateUrl> {
    serialize(routerState: RouterStateSnapshot): RouterStateUrl {
        const { url } = routerState;
        const queryParams = routerState.root.queryParams;

        return { url, queryParams };
    }
}

export function removeNulls(attribute: any, discardObjects: boolean = false): any {
    if (!attribute) { return {}; }
    let removed = Object.keys(attribute).reduce((coll, val, index) => {
        if (attribute[val]) {
            if (!discardObjects || checkByType(attribute[val])) {
                coll[val] = attribute[val];
            }
        }
        return coll;
    }, {});

    return removed;
}

export function checkByType(value): boolean {
    switch (typeof value) {
        case 'object': {
            return Object.keys(value).filter(k => !!value[k]).length > 0;
        }
        default: {
            return true;
        }
    }
}

export function pick(approvedProperties: string[]): Function {
    return (original) =>
        Object.keys(original)
            .filter((key) => approvedProperties.indexOf(key) > -1)
            .reduce((newObj, key) => {
                let value = original[key];
                newObj[key] = value;
                return newObj;
            }, {});
}

export function array_move(arr, old_index, new_index): any[] {
    if (new_index >= arr.length) {
        let k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
}

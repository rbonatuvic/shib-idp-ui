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

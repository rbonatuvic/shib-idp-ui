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
} /* istanbul ignore next */

export function removeNulls(attribute): any {
    if (!attribute) { return {}; }
    return Object.keys(attribute).reduce((coll, val, index) => {
        if (attribute[val]) {
            coll[val] = attribute[val];
        }
        return coll;
    }, {});
}

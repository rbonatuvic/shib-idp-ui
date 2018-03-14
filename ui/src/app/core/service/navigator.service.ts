import { Injectable } from '@angular/core';

@Injectable()
export class NavigatorService {
    constructor() {}

    get native(): any {
        return window.navigator;
    }
} /* istanbul ignore next */

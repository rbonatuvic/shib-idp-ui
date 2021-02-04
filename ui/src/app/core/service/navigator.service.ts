import { Injectable } from '@angular/core';

@Injectable()
export class NavigatorService {
    constructor() {}

    get native(): Navigator {
        return window.navigator;
    }
}

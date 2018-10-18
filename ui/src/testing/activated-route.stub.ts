/* istanbul ignore */

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { convertToParamMap, ParamMap, ActivatedRoute } from '@angular/router';

@Injectable()
export class ActivatedRouteStub {

    // ActivatedRoute.paramMap is Observable
    private subject = new BehaviorSubject(convertToParamMap(this.testParamMap));
    paramMap = this.subject.asObservable();

    // Test parameters
    private _testParamMap: ParamMap;

    private _firstChild: ActivatedRouteStub;

    get testParamMap() { return this._testParamMap; }
    set testParamMap(params: {}) {
        this._testParamMap = convertToParamMap(params);
        this.subject.next(this._testParamMap);
    }

    // ActivatedRoute.snapshot.paramMap
    get snapshot() {
        return {
            paramMap: this.testParamMap
        };
    }

    get params() {
        return this.paramMap;
    }

    get queryParams() {
        return this.paramMap;
    }

    get firstChild(): ActivatedRouteStub {
        return this._firstChild;
    }

    set firstChild(stub: ActivatedRouteStub) {
        this._firstChild = stub;
    }
}

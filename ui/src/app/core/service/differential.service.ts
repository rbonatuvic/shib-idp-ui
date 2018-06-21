import { Injectable } from '@angular/core';

import * as lib from 'deep-object-diff';

@Injectable()
export class DifferentialService {

    constructor() {}

    diff(originalObj, updatedObj) { // returns the difference of the original and updated objects
        return lib.diff(originalObj, updatedObj);
    }
    addedDiff(originalObj, updatedObj) { // returns only the values added to the updated object
        return lib.addedDiff(originalObj, updatedObj);
    }
    deletedDiff(originalObj, updatedObj) { // returns only the values deleted in the updated object
        return lib.deletedDiff(originalObj, updatedObj);
    }
    updatedDiff(originalObj, updatedObj) { // returns only the values that have been changed in the updated object
        return lib.updatedDiff(originalObj, updatedObj);
    }
    detailedDiff(originalObj, updatedObj) { // returns an object with the added, deleted and updated differences
        return lib.detailedDiff(originalObj, updatedObj);
    }
}

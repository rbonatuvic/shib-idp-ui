import { Injectable } from '@angular/core';


export enum ICONS {
    CHECK = 'CHECK',
    INDEX = 'INDEX'
}

@Injectable()
export class WizardService {

    public icons = ICONS;

    constructor() { }

    getIcon(current, last): string {
        return (last && current.index === last.index) ? ICONS.CHECK : ICONS.INDEX;
    }
}

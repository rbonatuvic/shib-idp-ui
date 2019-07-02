import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NavigationAction } from '../model/action';

@Injectable()
export class NavigationService {

    private actions: { [name: string]: NavigationAction} = {};
    private subj: BehaviorSubject<NavigationAction[]>;
    private obs: Observable<NavigationAction[]>;

    constructor() {
        this.subj = new BehaviorSubject<NavigationAction[]>(this.actionList);
        this.obs = this.subj.asObservable();
    }

    get actionList(): NavigationAction[] {
        return Object.values(this.actions);
    }

    get emitter(): Observable<NavigationAction[]> {
        return this.obs;
    }

    addAction(name: string, action: NavigationAction): NavigationAction[] {
        console.log(this.actions);
        this.actions[name] = action;
        this.subj.next(this.actionList);
        return this.actionList;
    }
}

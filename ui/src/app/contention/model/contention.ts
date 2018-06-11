export interface Versioned extends Object {
    version: number;
}

export interface Contention<T extends Versioned> {
    base: T;
    ours: T;
    theirs: T;

    rejectionObject: Object;
    resolutionObject: Object;

    ourChanges: T;
    theirChanges: T;

    handlers: {
        resolve(value: T),
        reject(value: T)
    };
}

export interface ContentionResolution<T> {
    value: T;
    handlers: {
        resolve(value: T),
        reject(value: T)
    };
}

export interface ChangeItem {
    label: string;
    value: any;
    conflict?: boolean;
}

export class ContentionEntity<T extends Versioned> implements Contention<T> {

    private _theirChanges: T;
    private _ourChanges: T;

    constructor(
        readonly base: T,
        readonly ours: T,
        readonly theirs: T,
        readonly handlers: { resolve(value: T), reject(value: T) }
    ) {}

    get theirChanges(): T {
        return this._theirChanges;
    }

    get ourChanges(): T {
        return this._ourChanges;
    }

    set theirChanges(changes: T) {
        this._theirChanges = changes;
    }

    set ourChanges(changes: T) {
        this._ourChanges = changes;
    }

    get rejectionObject (): Object {
        return this.theirs;
    }

    get resolutionObject (): Object {
        return { ...this.base as Object, ...this.ours as Object, version: this.theirs.version };
    }
}

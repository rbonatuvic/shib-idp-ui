export class Storage<T> {
    constructor(readonly key: string) {
        const list = localStorage.getItem(key);
        if (!list || !Array.isArray(JSON.parse(list))) {
            localStorage.setItem(key, JSON.stringify([]));
        }
    }

    add(obj): T[] {
        const list = this.query();
        list.push(obj);
        this.save(list);
        return list;
    }

    save(list): T[] {
        localStorage.setItem(this.key, JSON.stringify(list));
        return list;
    }

    findByAttr(val, attr: string = 'id'): T {
        const list = this.query();
        return list.find(entity => entity[attr] === val);
    }

    query(): T[] {
        const list = JSON.parse(localStorage.getItem(this.key));
        return [...list];
    }

    removeByAttr(val, attr: string = 'id'): void {
        const list = this.query().filter(entity => entity[attr] !== val);
        this.save(list);
        return null;
    }
} /* istanbul ignore next */

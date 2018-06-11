import { Storage } from './storage';

describe('storage class', () => {
    describe('key', () => {
        it('should set a readonly key', () => {
            let key = 'foo';
            let storage: Storage<string> = new Storage(key);
            expect(storage.key).toBe(key);
        });
        it('should check for a list in local storage', () => {
            spyOn(localStorage, 'getItem').and.returnValue('[]');
            spyOn(localStorage, 'setItem');
            let key = 'foo';
            let storage: Storage<string> = new Storage(key);
            expect(localStorage.setItem).not.toHaveBeenCalled();
        });
        it('should check if the list in local storage is an array', () => {
            spyOn(localStorage, 'getItem').and.returnValue('{}');
            spyOn(localStorage, 'setItem');
            let key = 'foo';
            let storage: Storage<string> = new Storage(key);
            expect(localStorage.setItem).toHaveBeenCalled();
        });
    });

    describe('add method', () => {
        it('should add the object to the stored list', () => {
            let key = 'foo';
            let storage: Storage<string> = new Storage(key);
            let obj = 'foo';
            spyOn(storage, 'save');
            spyOn(storage, 'query').and.returnValue([]);
            storage.add(obj);
            expect(storage.query).toHaveBeenCalled();
            expect(storage.save).toHaveBeenCalledWith([obj]);
        });
    });

    describe('save method', () => {
        it('should save the list to local storage', () => {
            let key = 'foo';
            let storage: Storage<string> = new Storage(key);
            let list = ['foo'];
            spyOn(localStorage, 'setItem');
            storage.save(list);
            expect(localStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify(list));
        });
    });

    describe('findByAttr method', () => {
        it('should retrieve an item from the list in local storage', () => {
            let key = 'foo';
            let storage: Storage<any> = new Storage(key);
            let list = [{ id: 'foo', name: 'bar' }];
            spyOn(storage, 'query').and.returnValue(list);
            expect(storage.findByAttr('foo')).toBe(list[0]);
        });

        it('should retrieve an item based on the provided key from the list in local storage', () => {
            let key = 'foo';
            let storage: Storage<any> = new Storage(key);
            let list = [{ val: 'foo', name: 'bar' }];
            spyOn(storage, 'query').and.returnValue(list);
            expect(storage.findByAttr('foo', 'val')).toBe(list[0]);
        });

        it('should return null if the item is not found', () => {
            let key = 'foo';
            let storage: Storage<any> = new Storage(key);
            let list = [{ val: 'foo', name: 'bar' }];
            spyOn(storage, 'query').and.returnValue(list);
            expect(storage.findByAttr('baz', 'val')).toBeUndefined();
        });
    });

    describe('query method', () => {
        it('should return the list from localStorage', () => {
            let list = ['foo'];
            let key = 'foo';
            spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(list));
            let storage: Storage<any> = new Storage(key);
            expect(storage.query()).toEqual(list);
        });
    });

    describe('removeByAttr method', () => {
        it('should remove an item from the list in local storage', () => {
            let key = 'foo';
            let storage: Storage<any> = new Storage(key);
            let list = [{ id: 'foo', name: 'bar' }];
            spyOn(storage, 'query').and.returnValue(list);
            spyOn(storage, 'save');
            storage.removeByAttr('foo');
            expect(storage.save).toHaveBeenCalledWith([]);
        });

        it('should remove an item from the list in local storage', () => {
            let key = 'foo';
            let storage: Storage<any> = new Storage(key);
            let list = [{ val: 'foo', name: 'bar' }];
            spyOn(storage, 'query').and.returnValue(list);
            spyOn(storage, 'save');
            storage.removeByAttr('foo', 'val');
            expect(storage.save).toHaveBeenCalledWith([]);
        });
    });
});

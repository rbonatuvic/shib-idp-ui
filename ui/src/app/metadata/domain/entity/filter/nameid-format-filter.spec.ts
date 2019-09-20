import { NameIDFormatFilterEntity } from './nameid-format-filter';

describe('NameIDFormatFilterEntity Entity', () => {
    let entity: NameIDFormatFilterEntity;
    beforeEach(() => {
        entity = new NameIDFormatFilterEntity({
            resourceId: 'foo',
            filterEnabled: false
        });
    });

    it('should be an instance', () => {
        expect(entity).toBeDefined();
        expect(entity.resourceId).toBe('foo');
        expect(entity.enabled).toBe(entity.filterEnabled);
        expect(entity.id).toBe(entity.resourceId);
        expect(entity.getId()).toBe(entity.resourceId);
        expect(entity.getDisplayId()).toBe(entity.resourceId);
        expect(entity.isDraft()).toBe(false);
    });
});

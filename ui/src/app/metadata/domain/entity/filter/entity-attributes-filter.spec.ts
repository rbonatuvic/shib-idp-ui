import { EntityAttributesFilterEntity } from './entity-attributes-filter';

describe('EntityAttributesFilter Entity', () => {
    let entity: EntityAttributesFilterEntity;
    beforeEach(() => {
        entity = new EntityAttributesFilterEntity({
            resourceId: 'foo',
            filterEnabled: false
        });
    });

    it('should be an instance', () => {
        expect(entity).toBeDefined();
        expect(entity.resourceId).toBe('foo');
        expect(entity.enabled).toBe(entity.filterEnabled);
        expect(entity.id).toBe(entity.resourceId);
        expect(entity.getId()).toBe(entity.entityId);
        expect(entity.getDisplayId()).toBe(entity.entityId);
        expect(entity.isDraft()).toBe(false);
    });
});

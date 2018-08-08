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
    });
});

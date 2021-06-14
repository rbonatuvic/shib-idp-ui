import { uuid } from './uuid';

it('should return a valid uuid', () => {
    expect(uuid()).toMatch(/[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/);
});
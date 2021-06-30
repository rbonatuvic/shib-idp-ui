import { createNotificationAction, reducer, removeNotificationAction } from './Notifications';

describe('Notifications HOC', () => {
    describe('reducer', () => {
        it('should add a notification to its state list', () => {
            const state = reducer({
                notifications: []
            }, createNotificationAction('foo'));
            expect(state.notifications.length).toBe(1);
        })

        it('should remove a notification to its state list', () => {
            const state = reducer({
                notifications: [
                    {
                        id: 'foo'
                    }
                ]
            }, removeNotificationAction('foo'));
            
            expect(state.notifications.length).toBe(0);
        })
    });
});
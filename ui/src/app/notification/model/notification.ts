export class Notification {
    createdAt: number = Date.now();
    constructor(
        public type: NotificationType = NotificationType.Info,
        public body: string = '',
        public timeout: number = 8000,
        public closeable: boolean = true
    ) {}
}

export enum NotificationType {
    Success = 'alert-success',
    Info = 'alert-info',
    Warning = 'alert-warning',
    Danger = 'alert-danger'
}

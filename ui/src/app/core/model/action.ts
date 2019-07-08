export interface NavigationAction {
    action: ($event: Event) => void;
    category: string;
    label: string;
    content: string;
    icon?: string;
}

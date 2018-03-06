export function dispatchKeyboardEvent(elm: HTMLElement, eventName: string, keyName: string) {
    let event;
    try {
        // PhantomJS
        event = document.createEvent('KeyboardEvent');
        event.initEvent(eventName, true, false);
        event.key = keyName;
    } catch (e) {
        // Chrome
        event = new KeyboardEvent(eventName, { 'key': keyName });
    }
    elm.dispatchEvent(event);
}

export default dispatchKeyboardEvent;

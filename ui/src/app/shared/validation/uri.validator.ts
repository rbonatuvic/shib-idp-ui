import { AbstractControl, ValidationErrors } from '@angular/forms';

export class UriValidator {
    static uri(control: AbstractControl): ValidationErrors | null {
        return UriValidator.isUri(control.value) ? null : { uri: true };
    }

    static isUri(value: string): boolean {
        try {
            let url = new URL(value);
        } catch (err) {
            return false;
        }
        return true;
    }
}

export default UriValidator;

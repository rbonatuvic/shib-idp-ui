import { PipeTransform, Pipe, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromI18n from '../reducer';
import { Subscription } from 'rxjs';
import { I18nService } from '../service/i18n.service';

@Pipe({
    name: 'translate',
    pure: false
})
export class TranslatePipe implements PipeTransform, OnDestroy {

    sub: Subscription;

    messages: { [propName: string]: string } = {};

    constructor(
        private store: Store<fromI18n.State>,
        private i18nService: I18nService,
        private _ref: ChangeDetectorRef
    ) {
        this.sub = this.store.select(fromI18n.getMessages).subscribe(messages => {
            this.messages = messages ? messages : {};
            this._ref.markForCheck();
        });
    }

    transform(value: string, interpolated: { [prop: string]: string } = {}): any {
        return this.i18nService.translate(value, interpolated, this.messages);
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }
}

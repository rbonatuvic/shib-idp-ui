import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { ProviderComponent } from './container/provider.component';
import { DraftComponent } from './container/draft.component';
import { WizardComponent } from './container/wizard.component';
import { EditorComponent } from './container/editor.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { RootProviderModule } from '../metadata-provider/metadata-provider.module';
import { ProviderEditorFormModule } from '../metadata-provider/component';
import { reducers } from './reducer';

import { UnsavedDialogComponent } from './component/unsaved-dialog.component';
import { CanDeactivateGuard } from '../core/service/can-deactivate.guard';
import { WizardNavComponent } from './component/wizard-nav.component';
import { WizardEffects } from './effect/wizard.effect';
import { EditorEffects } from './effect/editor.effect';
import { ValidFormIconComponent } from './component/valid-form-icon.component';

export const routes: Routes = [
    {
        path: ':id',
        component: ProviderComponent,
        canActivate: [],
        children: [
            { path: 'edit', redirectTo: 'edit/2' },
            {
                path: 'edit/:index',
                component: EditorComponent,
                canDeactivate: [CanDeactivateGuard]
            }
        ]
    },
    {
        path: ':entityId',
        component: DraftComponent,
        canActivate: [],
        children: [
            { path: 'wizard', redirectTo: 'wizard/2' },
            {
                path: 'wizard/:index',
                component: WizardComponent,
                canDeactivate: [CanDeactivateGuard]
            }
        ]
    }
];

@NgModule({
    declarations: [
        ProviderComponent,
        EditorComponent,
        WizardComponent,
        UnsavedDialogComponent,
        WizardNavComponent,
        DraftComponent,
        ValidFormIconComponent
    ],
    entryComponents: [
        UnsavedDialogComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        RootProviderModule,
        ProviderEditorFormModule,
        NgbDropdownModule,
        StoreModule.forFeature('edit-provider', reducers),
        EffectsModule.forFeature([WizardEffects, EditorEffects]),
        RouterModule.forChild(routes)
    ],
    providers: []
})
export class EditorModule { }

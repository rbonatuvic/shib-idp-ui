import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserPageComponent } from './user.component';


const routes: Routes = [
    {
        path: '',
        component: UserPageComponent,
        children: []
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [RouterModule]
})
export class UserRoutingModule { }

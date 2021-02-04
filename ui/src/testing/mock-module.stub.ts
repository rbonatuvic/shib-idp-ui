import { NgModule } from '@angular/core';
import { MockResolversListComponent } from './resolvers-list.component.stub';

export const DECLARATIONS = [
    MockResolversListComponent
];

@NgModule({
    declarations: DECLARATIONS,
    entryComponents: DECLARATIONS,
    imports: [],
    exports: DECLARATIONS,
    providers: []
})
export class MockModule {}

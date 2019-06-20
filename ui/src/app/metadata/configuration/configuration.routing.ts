import { Routes } from '@angular/router';
import { ConfigurationComponent } from './container/configuration.component';
import { MetadataOptionsComponent } from './container/metadata-options.component';
import { MetadataXmlComponent } from './container/metadata-xml.component';
import { MetadataHistoryComponent } from './container/metadata-history.component';

export const ConfigurationRoutes: Routes = [
    {
        path: ':type/:id/configuration',
        component: ConfigurationComponent,
        children: [
            {
                path: '',
                redirectTo: 'options'
            },
            {
                path: 'options',
                component: MetadataOptionsComponent
            },
            {
                path: 'xml',
                component: MetadataXmlComponent
            },
            {
                path: 'history',
                component: MetadataHistoryComponent
            }
        ]
    }
];

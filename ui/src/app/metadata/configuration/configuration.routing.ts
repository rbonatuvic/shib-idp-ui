import { Routes } from '@angular/router';
import { ConfigurationComponent } from './container/configuration.component';
import { MetadataOptionsComponent } from './container/metadata-options.component';
import { MetadataXmlComponent } from './container/metadata-xml.component';
import { MetadataHistoryComponent } from './container/metadata-history.component';
import { MetadataComparisonComponent } from './container/metadata-comparison.component';
import { RestoreComponent } from './container/restore.component';
import { VersionComponent } from './container/version.component';
import { VersionOptionsComponent } from './container/version-options.component';

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
            },
            {
                path: 'compare',
                component: MetadataComparisonComponent
            },
            {
                path: 'version/:version',
                component: VersionComponent,
                children: [
                    {
                        path: 'options',
                        component: VersionOptionsComponent
                    },
                    {
                        path: 'restore',
                        component: RestoreComponent
                    }
                ]
            }
        ]
    }
];

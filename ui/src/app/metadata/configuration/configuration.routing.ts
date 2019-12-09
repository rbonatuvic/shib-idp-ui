import { Routes } from '@angular/router';
import { ConfigurationComponent } from './container/configuration.component';
import { MetadataOptionsComponent } from './container/metadata-options.component';
import { MetadataXmlComponent } from './container/metadata-xml.component';
import { MetadataHistoryComponent } from './container/metadata-history.component';
import { MetadataComparisonComponent } from './container/metadata-comparison.component';
import { RestoreComponent } from './container/restore.component';
import { VersionComponent } from './container/version.component';
import { VersionOptionsComponent } from './container/version-options.component';
import { RestoreEditComponent } from './container/restore-edit.component';
import { IndexResolver } from './service/index-resolver.service';
import { RestoreEditStepComponent } from './container/restore-edit-step.component';

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
                component: MetadataOptionsComponent,
                data: { title: `Metadata Configuration Options` }
            },
            {
                path: 'xml',
                component: MetadataXmlComponent,
                data: { title: `Metadata Configuration XML` }
            },
            {
                path: 'history',
                component: MetadataHistoryComponent,
                data: { title: `Metadata History` }
            },
            {
                path: 'compare',
                component: MetadataComparisonComponent,
                data: { title: `Metadata Comparison` }
            },
            {
                path: 'version/:version',
                component: VersionComponent,
                children: [
                    {
                        path: 'options',
                        component: VersionOptionsComponent,
                        data: { title: `Metadata Version Options` }
                    },
                    {
                        path: 'restore',
                        component: RestoreComponent,
                        data: { title: `Restore Metadata Version` }
                    },
                    {
                        path: 'edit',
                        redirectTo: 'edit/common'
                    },
                    {
                        path: 'edit',
                        component: RestoreEditComponent,
                        children: [
                            {
                                path: ':index',
                                component: RestoreEditStepComponent,
                                resolve: {
                                    index: IndexResolver
                                },
                                data: { title: `Edit Metadata` }
                            }
                        ]
                    }
                ]
            }
        ]
    }
];

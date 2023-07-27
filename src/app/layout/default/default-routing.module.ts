import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DefaultComponent } from './default.component';
import { TenantDashboardModule } from '../../pages/tenant-dashboard/tenant-dashboard.module';

const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    children: [
      { path: '', redirectTo: 'page-demo', pathMatch: 'full' },
      {
        path: 'dashboard',
        data: { preload: true },
        loadChildren: () => import('../../pages/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'page-demo',
        loadChildren: () => import('../../pages/page-demo/page-demo.module').then(m => m.PageDemoModule)
      },
      {
        path: 'about',
        loadChildren: () => import('../../pages/about/about.module').then(m => m.AboutModule)
      },
      {
        path: ':tenantIdentifier',
        data: { preload: true },
        loadChildren: () => import('../../pages/tenant-dashboard/tenant-dashboard.module').then(m => m.TenantDashboardModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DefaultRoutingModule { }

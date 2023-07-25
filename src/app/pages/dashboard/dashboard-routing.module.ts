import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'analysis', pathMatch: 'full' },
  {
    path: 'workbench',
    data: { preload: true },
    loadChildren: () => import('./workbench/workbench.module').then(m => m.WorkbenchModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }

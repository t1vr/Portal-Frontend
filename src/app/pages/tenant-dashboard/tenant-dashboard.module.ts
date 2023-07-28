import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenantDashboardComponent } from './tenant-dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { ProgramsComponent } from './programs/programs.component';
import { SharedModule } from '@app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: TenantDashboardComponent,
    children: [
      { path: 'overview', component: OverviewComponent },
      { path: 'programs', component: ProgramsComponent },
      { path: '', pathMatch: 'full', redirectTo: 'overview' }

    ],
  },

];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TenantDashboardComponent,
    OverviewComponent,
    ProgramsComponent
  ]
})
export class TenantDashboardModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { RouterModule } from '@angular/router';
import { BreedsComponent } from './pages/breeds/breeds.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';
import { BreedDetailComponent } from './modals/breed-detail/breed-detail.component';

@NgModule({
  declarations: [DashboardComponent, BreedsComponent, UserProfileComponent, BreedDetailComponent],
  imports: [CommonModule, LayoutModule, DashboardRoutingModule, RouterModule, SharedModule],
})
export class DashboardModule {}

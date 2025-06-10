import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core/core.module';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [NavBarComponent],
  imports: [CommonModule, SharedModule, CoreModule, RouterModule],
  exports: [NavBarComponent],
})
export class LayoutModule {}

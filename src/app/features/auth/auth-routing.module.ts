import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AuthenticationService } from './service/authentication.service';
import { CoreModule } from '../../core/core.module';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes), CoreModule, SharedModule],
  exports: [RouterModule],
  providers: [AuthenticationService],
})
export class AuthRoutingModule {}

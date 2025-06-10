import { Injectable } from '@angular/core';
import { CanActivate, CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class NoAuthGuard implements CanActivate {
  constructor(private authSvc: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    const isLoggedIn = this.authSvc.isAuthenticated();

    if (isLoggedIn) {
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }
}

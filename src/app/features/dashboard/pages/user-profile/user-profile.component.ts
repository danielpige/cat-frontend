import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit {
  currentUser!: User | null;

  constructor(private authSvc: AuthService) {}

  ngOnInit(): void {
    this.getCurrentUser();
  }

  getCurrentUser(): void {
    this.authSvc.user$.subscribe({
      next: (user) => {
        console.log(user);

        this.currentUser = user;
      },
    });
  }
}

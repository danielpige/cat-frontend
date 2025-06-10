import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, UserResponse } from '../models/user.model';
import { EncryptionService } from './encription.service';
import { TokenKeys } from '../enums/tokenKey.enum';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);

  constructor(private encription: EncryptionService) {
    const stored = this.encription.getDecryptedItem(TokenKeys.AUTH_USER);
    console.log(stored);

    if (stored) {
      this.userSubject.next(JSON.parse(stored));
    }
  }

  get user$(): Observable<User | null> {
    return this.userSubject.asObservable();
  }

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  setDataUserLogged(userData: UserResponse): void {
    this.setUser(userData.user);
    localStorage.setItem(TokenKeys.AUTH_TOKEN, userData.token);
  }

  setUser(user: User): void {
    this.userSubject.next(user);
    this.encription.setEncryptedItem(TokenKeys.AUTH_USER, JSON.stringify(user)); // opcional
  }

  getToken(): string | null {
    return localStorage.getItem(TokenKeys.AUTH_TOKEN);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();

    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp;
      const now = Math.floor(Date.now() / 1000);
      return exp > now;
    } catch (error) {
      return false;
    }
  }

  logout(): void {
    localStorage.clear();
    this.userSubject.next(null);
  }
}

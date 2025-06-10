import { FormControl } from '@angular/forms';

export interface User {
  id?: string;
  username: string;
  fullname?: string;
  enable?: boolean;
  password: string;
  email?: string;
}

export interface UserResponse {
  token: string;
  user: User;
}

export type LoginValues = Pick<User, 'username' | 'password'>;

export type LoginForm = {
  [K in keyof LoginValues]?: FormControl<LoginValues[K] | null>;
};

export type RegisterValues = Pick<User, 'username' | 'password' | 'email' | 'fullname'> & {
  confirmPassword: string;
};

export type RegisterForm = {
  [K in keyof RegisterValues]?: FormControl<RegisterValues[K] | null>;
};

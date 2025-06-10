import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(private snackBar: MatSnackBar) {}

  success(message: string, duration: number = 4000) {
    this.show(message, 'snackbar-success', duration);
  }

  error(message: string, duration: number = 5000) {
    this.show(message, 'snackbar-error', duration);
  }

  info(message: string, duration: number = 4000) {
    this.show(message, 'snackbar-info', duration);
  }

  warn(message: string, duration: number = 4000) {
    this.show(message, 'snackbar-warn', duration);
  }

  private show(message: string, panelClass: string, duration: number) {
    this.snackBar.open(message, 'Cerrar', {
      duration,
      panelClass: [panelClass],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
}

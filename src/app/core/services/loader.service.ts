import { Injectable } from '@angular/core';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private dialogRef?: MatDialogRef<LoaderComponent>;

  constructor(private dialog: MatDialog) {}

  show(): void {
    if (!this.dialogRef) {
      this.dialogRef = this.dialog.open(LoaderComponent, {
        disableClose: true,
        panelClass: 'transparent-dialog',
        hasBackdrop: true,
        backdropClass: 'dark-backdrop',
      });
    }
  }

  hide(): void {
    this.dialogRef?.close();
    this.dialogRef = undefined;
  }
}

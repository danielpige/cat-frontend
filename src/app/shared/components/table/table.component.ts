import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Breed } from '../../../core/models/breeds.model';
import { MatDialog } from '@angular/material/dialog';
import { BreedDetailComponent } from '../../../features/dashboard/modals/breed-detail/breed-detail.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  @Input() displayedColumns: Array<Partial<keyof Breed>> = [];
  @Input() dataSource: Breed[] = [];

  constructor(private dialog: MatDialog) {}

  selectedRow(data: Breed): void {
    this.dialog.open(BreedDetailComponent, {
      width: '1000px',
      disableClose: true,
      data,
    });
  }
}

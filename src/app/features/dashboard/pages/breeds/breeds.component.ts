import { Component } from '@angular/core';
import { Breed } from '../../../../core/models/breeds.model';

@Component({
  selector: 'app-breeds',
  templateUrl: './breeds.component.html',
  styleUrl: './breeds.component.scss',
})
export class BreedsComponent {
  displayedColumns: Array<Partial<keyof Breed>> = ['id', 'name', 'origin', 'adaptability', 'intelligence', 'child_friendly'];
  dataSource: Breed[] = [];

  refreshData(data: Breed[] | []): void {
    this.dataSource = [...data];
  }
}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BreedService } from '../../../features/dashboard/service/breed.service';
import { Breed } from '../../../core/models/breeds.model';
import { LoaderService } from '../../../core/services/loader.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss',
})
export class FiltersComponent implements OnInit {
  @Output() sendData = new EventEmitter<Breed[] | []>();

  constructor(private breedSvc: BreedService, private loaderSvc: LoaderService) {}

  ngOnInit(): void {
    // setTimeout(() => {
    this.search();
    // }, 2000);
  }

  search(query: string = ''): void {
    const search = query.length === 0 ? false : true;
    const method = search ? this.breedSvc.getBreedByQuery(query) : this.breedSvc.getAllBreeds();

    this.loaderSvc.show();

    method.subscribe({
      next: (res) => {
        const data = [...res.data];
        this.sendData.emit(data);
        this.loaderSvc.hide();
      },
      error: () => {
        this.sendData.emit([]);
        this.loaderSvc.hide();
      },
    });
  }
}

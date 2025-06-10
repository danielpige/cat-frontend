import { Component, inject, OnInit } from '@angular/core';
import { Breed } from '../../../../core/models/breeds.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BreedService } from '../../service/breed.service';
import { LoaderService } from '../../../../core/services/loader.service';
import { Images } from '../../../../core/models/images.model';

@Component({
  selector: 'app-breed-detail',
  templateUrl: './breed-detail.component.html',
  styleUrl: './breed-detail.component.scss',
})
export class BreedDetailComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<BreedDetailComponent>);
  readonly data = inject<Breed>(MAT_DIALOG_DATA);
  readonly displayedColumns: string[] = Object.keys(this.data);
  images: Images[] = [];

  constructor(private breedSvc: BreedService, private loaderSvc: LoaderService) {}

  ngOnInit(): void {
    this.getImages();
  }

  private getImages(): void {
    this.loaderSvc.show();
    this.breedSvc.getImagesByBreedId(this.data.id).subscribe({
      next: (res) => {
        this.images = [...res.data];

        this.loaderSvc.hide();
      },
      error: () => {
        this.images = [];
        this.loaderSvc.hide();
      },
    });
  }

  getData(key: string): any {
    return (this.data as any)[key];
  }
}

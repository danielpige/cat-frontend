import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material/material.module';
import { LoaderComponent } from './components/loader/loader.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';
import { TableComponent } from './components/table/table.component';
import { TranslateBreedKeyPipePipe } from './pipes/translate-breed-key-pipe.pipe';
import { FiltersComponent } from './components/filters/filters.component';
import { CarouselComponent } from './components/carousel/carousel.component';

@NgModule({
  declarations: [LoaderComponent, TableComponent, TranslateBreedKeyPipePipe, FiltersComponent, CarouselComponent],
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule, LayoutModule],
  exports: [CommonModule, MaterialModule, TableComponent, TranslateBreedKeyPipePipe, FiltersComponent, CarouselComponent],
})
export class SharedModule {}

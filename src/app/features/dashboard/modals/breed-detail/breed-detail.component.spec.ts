import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BreedDetailComponent } from './breed-detail.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { Component, Input } from '@angular/core';
import { BreedService } from '../../service/breed.service';
import { Breed } from '../../../../core/models/breeds.model';
import { Images } from '../../../../core/models/images.model';
import { ApiResponse } from '../../../../core/models/apiResponse.model';

// Mock Pipe
@Pipe({ name: 'translateBreedKeyPipe' })
class MockTranslateBreedKeyPipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

// Mock Carousel Component
@Component({
  selector: 'app-carousel',
  template: '<ng-content></ng-content>',
})
class MockAppCarouselComponent {
  @Input() images: string[] = [];
}

describe('BreedDetailComponent (DOM-focused)', () => {
  let component: BreedDetailComponent;
  let fixture: ComponentFixture<BreedDetailComponent>;
  let breedServiceSpy: jasmine.SpyObj<BreedService>;

  const mockBreed: Breed = {
    id: '1',
    name: 'Husky',
    weight: { imperial: '55 - 80', metric: '25 - 36' },
    life_span: '12 - 15 years',
    temperament: 'Friendly, Energetic',
    origin: 'Siberia',
    reference_image_id: 'abc123',
    country_codes: '',
    country_code: '',
    description: '',
    indoor: 0,
    alt_names: '',
    adaptability: 0,
    affection_level: 0,
    child_friendly: 0,
    dog_friendly: 0,
    energy_level: 0,
    grooming: 0,
    health_issues: 0,
    intelligence: 0,
    shedding_level: 0,
    social_needs: 0,
    stranger_friendly: 0,
    vocalisation: 0,
    experimental: 0,
    hairless: 0,
    natural: 0,
    rare: 0,
    rex: 0,
    suppressed_tail: 0,
    short_legs: 0,
    hypoallergenic: 0,
  };

  const imagesMock: ApiResponse<Images[]> = {
    data: [
      {
        url: 'img1.jpg',
        id: '',
        width: 0,
        height: 0,
      },
      {
        url: 'img2.jpg',
        id: '',
        width: 0,
        height: 0,
      },
    ],
    success: true,
    message: 'Images loaded',
  };

  beforeEach(async () => {
    breedServiceSpy = jasmine.createSpyObj('BreedService', ['getImagesByBreedId']);

    await TestBed.configureTestingModule({
      declarations: [BreedDetailComponent, MockTranslateBreedKeyPipe, MockAppCarouselComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockBreed },
        { provide: MatDialogRef, useValue: {} },
        { provide: BreedService, useValue: breedServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(BreedDetailComponent);
    component = fixture.componentInstance;
  });

  it('debería llamar a getImages() al iniciar', () => {
    breedServiceSpy.getImagesByBreedId.and.returnValue(of(imagesMock));
    fixture.detectChanges();
    expect(breedServiceSpy.getImagesByBreedId).toHaveBeenCalledWith(mockBreed.id);
  });

  it('debería renderizar el título con el nombre de la raza', () => {
    breedServiceSpy.getImagesByBreedId.and.returnValue(of(imagesMock));
    fixture.detectChanges();
    const titleElement: HTMLElement = fixture.nativeElement.querySelector('h2');
    expect(titleElement.textContent).toContain('Husky');
  });

  it('debería mostrar el componente de carrusel si hay imágenes', () => {
    breedServiceSpy.getImagesByBreedId.and.returnValue(of(imagesMock));
    fixture.detectChanges();
    const carouselComponent = fixture.nativeElement.querySelector('app-carousel');
    expect(carouselComponent).toBeTruthy();
  });

  it('no debería mostrar el componente de carrusel si no hay imágenes', () => {
    const emptyImages: ApiResponse<Images[] | []> = {
      data: [],
      success: true,
      message: 'No images',
    };
    breedServiceSpy.getImagesByBreedId.and.returnValue(of(emptyImages));
    fixture.detectChanges();
    const carouselComponent = fixture.nativeElement.querySelector('app-carousel');
    expect(carouselComponent).toBeNull();
  });

  it('debería manejar errores de getImages()', () => {
    breedServiceSpy.getImagesByBreedId.and.returnValue(throwError(() => new Error('Network error')));
    fixture.detectChanges();
    expect(component.images).toEqual([]);
  });
});

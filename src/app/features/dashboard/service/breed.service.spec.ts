import { TestBed } from '@angular/core/testing';
import { BreedService } from './breed.service';
import { HttpService } from '../../../core/services/http.service';
import { of } from 'rxjs';
import { ApiResponse } from '../../../core/models/apiResponse.model';
import { Breed } from '../../../core/models/breeds.model';
import { Images } from '../../../core/models/images.model';

describe('BreedService', () => {
  let service: BreedService;
  let httpServiceSpy: jasmine.SpyObj<HttpService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('HttpService', ['get']);

    TestBed.configureTestingModule({
      providers: [BreedService, { provide: HttpService, useValue: spy }],
    });

    service = TestBed.inject(BreedService);
    httpServiceSpy = TestBed.inject(HttpService) as jasmine.SpyObj<HttpService>;
  });

  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener todas las razas', () => {
    const expectedResponse: ApiResponse<Breed[]> = { data: [], message: 'ok', success: true };
    httpServiceSpy.get.and.returnValue(of(expectedResponse));

    service.getAllBreeds().subscribe((res) => {
      expect(res).toEqual(expectedResponse);
    });

    expect(httpServiceSpy.get).toHaveBeenCalledWith('cats/breeds');
  });

  it('debería obtener una raza por id', () => {
    const id = 'abc123';
    const expectedResponse: ApiResponse<Breed | null> = { data: null, message: 'ok', success: true };
    httpServiceSpy.get.and.returnValue(of(expectedResponse));

    service.getBreedById(id).subscribe((res) => {
      expect(res).toEqual(expectedResponse);
    });

    expect(httpServiceSpy.get).toHaveBeenCalledWith(`cats/breeds/${id}`);
  });

  it('debería buscar razas por query', () => {
    const query = 'siamese';
    const expectedResponse: ApiResponse<Breed[]> = { data: [], message: 'ok', success: true };
    httpServiceSpy.get.and.returnValue(of(expectedResponse));

    service.getBreedByQuery(query).subscribe((res) => {
      expect(res).toEqual(expectedResponse);
    });

    expect(httpServiceSpy.get).toHaveBeenCalledWith(`cats/breeds/search?q=${query}`);
  });

  it('debería obtener imágenes por breedId', () => {
    const id = 'siam123';
    const expectedResponse: ApiResponse<Images[]> = { data: [], message: 'ok', success: true };
    httpServiceSpy.get.and.returnValue(of(expectedResponse));

    service.getImagesByBreedId(id).subscribe((res) => {
      expect(res).toEqual(expectedResponse);
    });

    expect(httpServiceSpy.get).toHaveBeenCalledWith(`images/imagesbybreedid?breed_id=${id}`);
  });
});

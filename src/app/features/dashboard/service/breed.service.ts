import { Injectable } from '@angular/core';
import { HttpService } from '../../../core/services/http.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/models/apiResponse.model';
import { Breed } from '../../../core/models/breeds.model';
import { Images } from '../../../core/models/images.model';

@Injectable({
  providedIn: 'root',
})
export class BreedService {
  private readonly ENDPOINTS = {
    BASE: 'cats/breeds',
    BASE_PARAM: (param: string): string => 'cats/breeds/' + param,
    BASE_QUERY: (query: string): string => 'cats/breeds/search?q=' + query,
    GET_IMAGE_BY_ID: (id: string): string => 'images/imagesbybreedid?breed_id=' + id,
  };

  constructor(private httpSvc: HttpService) {}

  getAllBreeds(): Observable<ApiResponse<Breed[]>> {
    return this.httpSvc.get(this.ENDPOINTS.BASE);
  }

  getBreedById(id: string): Observable<ApiResponse<Breed | null>> {
    return this.httpSvc.get(this.ENDPOINTS.BASE_PARAM(id));
  }

  getBreedByQuery(query: string): Observable<ApiResponse<Breed[] | []>> {
    return this.httpSvc.get(this.ENDPOINTS.BASE_QUERY(query));
  }

  getImagesByBreedId(id: string): Observable<ApiResponse<Images[] | []>> {
    return this.httpSvc.get(this.ENDPOINTS.GET_IMAGE_BY_ID(id));
  }
}

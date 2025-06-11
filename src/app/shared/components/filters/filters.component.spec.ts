import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FiltersComponent } from './filters.component';
import { BreedService } from '../../../features/dashboard/service/breed.service';
import { LoaderService } from '../../../core/services/loader.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('FiltersComponent (extended)', () => {
  let component: FiltersComponent;
  let fixture: ComponentFixture<FiltersComponent>;
  let breedServiceSpy: jasmine.SpyObj<BreedService>;
  let loaderServiceSpy: jasmine.SpyObj<LoaderService>;

  const mockBreeds = [{ id: '1', name: 'Bengal', description: 'desc', origin: 'US' } as any];

  beforeEach(async () => {
    const breedSpy = jasmine.createSpyObj('BreedService', ['getAllBreeds', 'getBreedByQuery']);
    const loaderSpy = jasmine.createSpyObj('LoaderService', ['show', 'hide']);

    await TestBed.configureTestingModule({
      declarations: [FiltersComponent],
      imports: [MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, FormsModule, NoopAnimationsModule],
      providers: [
        { provide: BreedService, useValue: breedSpy },
        { provide: LoaderService, useValue: loaderSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FiltersComponent);
    component = fixture.componentInstance;
    breedServiceSpy = TestBed.inject(BreedService) as jasmine.SpyObj<BreedService>;
    loaderServiceSpy = TestBed.inject(LoaderService) as jasmine.SpyObj<LoaderService>;
  });

  it('debería crearse', () => {
    breedServiceSpy.getAllBreeds.and.returnValue(of({ success: true, message: 'OK', data: mockBreeds }));
    fixture.detectChanges(); // ngOnInit()
    expect(component).toBeTruthy();
  });

  it('debería buscar todas las razas al iniciar', () => {
    const emitSpy = spyOn(component.sendData, 'emit');

    breedServiceSpy.getAllBreeds.and.returnValue(of({ success: true, message: 'OK', data: mockBreeds }));

    fixture.detectChanges(); // ngOnInit()

    expect(loaderServiceSpy.show).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith(mockBreeds);
    expect(loaderServiceSpy.hide).toHaveBeenCalled();
  });

  it('debería emitir [] si hay un error en la búsqueda', () => {
    const emitSpy = spyOn(component.sendData, 'emit');

    breedServiceSpy.getAllBreeds.and.returnValue(throwError(() => new Error('Error')));

    fixture.detectChanges(); // ngOnInit()

    expect(emitSpy).toHaveBeenCalledWith([]);
    expect(loaderServiceSpy.hide).toHaveBeenCalled();
  });

  it('debería buscar por query al hacer clic en el botón', () => {
    const emitSpy = spyOn(component.sendData, 'emit');

    breedServiceSpy.getAllBreeds.and.returnValue(of({ success: true, message: 'OK', data: [] }));

    breedServiceSpy.getBreedByQuery.and.returnValue(of({ success: true, message: 'OK', data: [mockBreeds[0]] }));

    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    input.value = 'bengal';
    input.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    button.click();

    expect(breedServiceSpy.getBreedByQuery).toHaveBeenCalledWith('bengal');
    expect(emitSpy).toHaveBeenCalledWith([mockBreeds[0]]);
  });

  it('debería renderizar el campo de búsqueda y botón', () => {
    breedServiceSpy.getAllBreeds.and.returnValue(of({ success: true, message: 'OK', data: mockBreeds }));

    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input'));
    const button = fixture.debugElement.query(By.css('button'));

    expect(input).toBeTruthy();
    expect(button).toBeTruthy();
  });
});

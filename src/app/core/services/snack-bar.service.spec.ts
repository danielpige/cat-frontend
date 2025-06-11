import { TestBed } from '@angular/core/testing';
import { SnackBarService } from './snack-bar.service';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('SnackBarService', () => {
  let service: SnackBarService;
  let matSnackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    matSnackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      providers: [SnackBarService, { provide: MatSnackBar, useValue: matSnackBarSpy }],
    });

    service = TestBed.inject(SnackBarService);
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería mostrar un mensaje de éxito', () => {
    service.success('Éxito');
    expect(matSnackBarSpy.open).toHaveBeenCalledWith('Éxito', 'Cerrar', {
      duration: 4000,
      panelClass: ['snackbar-success'],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  });

  it('debería mostrar un mensaje de error', () => {
    service.error('Error');
    expect(matSnackBarSpy.open).toHaveBeenCalledWith('Error', 'Cerrar', {
      duration: 5000,
      panelClass: ['snackbar-error'],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  });

  it('debería mostrar un mensaje de información', () => {
    service.info('Info');
    expect(matSnackBarSpy.open).toHaveBeenCalledWith('Info', 'Cerrar', {
      duration: 4000,
      panelClass: ['snackbar-info'],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  });

  it('debería mostrar un mensaje de advertencia', () => {
    service.warn('Advertencia');
    expect(matSnackBarSpy.open).toHaveBeenCalledWith('Advertencia', 'Cerrar', {
      duration: 4000,
      panelClass: ['snackbar-warn'],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  });
});

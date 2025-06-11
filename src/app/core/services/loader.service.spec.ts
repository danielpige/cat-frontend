import { TestBed } from '@angular/core/testing';
import { LoaderService } from './loader.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

describe('LoaderService', () => {
  let service: LoaderService;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<LoaderComponent>>;

  beforeEach(() => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    matDialogSpy.open.and.returnValue(dialogRefSpy);

    TestBed.configureTestingModule({
      providers: [LoaderService, { provide: MatDialog, useValue: matDialogSpy }],
    });

    service = TestBed.inject(LoaderService);
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería mostrar el loader si no está ya abierto', () => {
    service.show();
    expect(matDialogSpy.open).toHaveBeenCalledWith(LoaderComponent, {
      disableClose: true,
      panelClass: 'transparent-dialog',
      hasBackdrop: true,
      backdropClass: 'dark-backdrop',
    });
  });

  it('no debería abrir el loader si ya está abierto', () => {
    service.show(); // primera vez
    service.show(); // segunda vez
    expect(matDialogSpy.open).toHaveBeenCalledTimes(1); // solo una vez
  });

  it('debería cerrar el loader si está abierto', () => {
    service.show();
    service.hide();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('no debería lanzar error si hide() es llamado sin haber abierto el loader', () => {
    expect(() => service.hide()).not.toThrow();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableComponent } from './table.component';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Component, Pipe, PipeTransform } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { Breed } from '../../../core/models/breeds.model';
import { MatTooltipModule } from '@angular/material/tooltip';

@Pipe({ name: 'translateBreedKeyPipe' })
class MockTranslateBreedKeyPipe implements PipeTransform {
  transform(value: string): string {
    return `Traducido-${value}`;
  }
}

@Component({ selector: 'app-breed-detail', template: '' })
class MockBreedDetailComponent {}

describe('TableComponent (DOM)', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  const mockBreed: Breed = {
    id: 'abys',
    name: 'Abyssinian',
    description: 'Active, energetic, independent, intelligent, gentle',
    temperament: 'Active, Energetic, Independent, Intelligent, Gentle',
    origin: 'Egypt',
    life_span: '14 - 15',
    adaptability: 5,
    affection_level: 5,
    child_friendly: 3,
    dog_friendly: 4,
    energy_level: 5,
    grooming: 1,
    health_issues: 2,
    intelligence: 5,
    shedding_level: 2,
    social_needs: 5,
    stranger_friendly: 5,
    vocalisation: 1,
    experimental: 0,
    hairless: 0,
    natural: 1,
    rare: 0,
    rex: 0,
    suppressed_tail: 0,
    short_legs: 0,
    hypoallergenic: 0,
    reference_image_id: '0XYvRd7oD',
    weight: {
      imperial: '2 - 5',
      metric: '5 - 10',
    },
    country_codes: '',
    country_code: '',
    indoor: 0,
    alt_names: '',
  };

  beforeEach(async () => {
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [TableComponent, MockTranslateBreedKeyPipe, MockBreedDetailComponent],
      imports: [MatTableModule, MatTooltipModule, MatDialogModule, BrowserAnimationsModule],
      providers: [{ provide: MatDialog, useValue: mockDialog }],
    }).compileComponents();

    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;

    component.displayedColumns = ['id', 'name', 'origin'];
    component.dataSource = [mockBreed];

    fixture.detectChanges();
  });

  it('debería renderizar la tabla con los encabezados traducidos', () => {
    const headers = fixture.debugElement.queryAll(By.css('th'));
    expect(headers.length).toBe(3);
    expect(headers.map((h) => h.nativeElement.textContent.trim())).toEqual(['Traducido-id', 'Traducido-name', 'Traducido-origin']);
  });

  it('debería mostrar los datos del breed en la fila', () => {
    const cells = fixture.debugElement.queryAll(By.css('td'));
    expect(cells.length).toBe(3);
    expect(cells[0].nativeElement.textContent.trim()).toBe(mockBreed.id);
    expect(cells[1].nativeElement.textContent.trim()).toBe(mockBreed.name);
    expect(cells[2].nativeElement.textContent.trim()).toBe(mockBreed.origin);
  });

  it('debería abrir el diálogo al hacer clic en una fila', () => {
    const row = fixture.debugElement.query(By.css('.item-row'));
    row.triggerEventHandler('click');
    fixture.detectChanges();

    expect(mockDialog.open).toHaveBeenCalledWith(jasmine.any(Function), {
      width: '1000px',
      disableClose: true,
      data: mockBreed,
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BreedsComponent } from './breeds.component';
import { CUSTOM_ELEMENTS_SCHEMA, Component, EventEmitter, Input, Output } from '@angular/core';
import { Breed } from '../../../../core/models/breeds.model';
import { By } from '@angular/platform-browser';

// Mock app-filters
@Component({
  selector: 'app-filters',
  template: '',
})
class MockFiltersComponent {
  @Output() sendData = new EventEmitter<Breed[]>();
}

// Mock app-table
@Component({
  selector: 'app-table',
  template: '',
})
class MockTableComponent {
  @Input() dataSource: Breed[] = [];
  @Input() displayedColumns: string[] = [];
}

describe('BreedsComponent', () => {
  let component: BreedsComponent;
  let fixture: ComponentFixture<BreedsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BreedsComponent, MockFiltersComponent, MockTableComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // por si hay otros elementos no declarados
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BreedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería renderizar el título "Razas"', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('h2');
    expect(title?.textContent).toContain('Razas');
  });

  it('debería actualizar dataSource al recibir datos desde app-filters', () => {
    const mockData: Breed[] = [
      {
        id: '1',
        name: 'Siberian',
        weight: { imperial: '10 - 20', metric: '4 - 9' },
        life_span: '12 - 15',
        temperament: 'Affectionate',
        origin: 'Russia',
        reference_image_id: '',
        country_codes: '',
        country_code: '',
        description: '',
        indoor: 0,
        alt_names: '',
        adaptability: 5,
        affection_level: 5,
        child_friendly: 5,
        dog_friendly: 5,
        energy_level: 5,
        grooming: 3,
        health_issues: 1,
        intelligence: 5,
        shedding_level: 4,
        social_needs: 3,
        stranger_friendly: 4,
        vocalisation: 1,
        experimental: 0,
        hairless: 0,
        natural: 1,
        rare: 0,
        rex: 0,
        suppressed_tail: 0,
        short_legs: 0,
        hypoallergenic: 1,
      },
    ];

    const filtersComponent = fixture.debugElement.query(By.directive(MockFiltersComponent)).componentInstance;
    filtersComponent.sendData.emit(mockData);
    fixture.detectChanges();

    expect(component.dataSource).toEqual(mockData);
  });

  it('debería pasar dataSource y displayedColumns a app-table', () => {
    const mockData: Breed[] = [{ id: '1', name: 'Siberian', origin: 'Russia' } as Breed];
    component.refreshData(mockData);
    fixture.detectChanges();

    const tableComponent = fixture.debugElement.query(By.directive(MockTableComponent)).componentInstance;

    expect(tableComponent.dataSource).toEqual(mockData);
    expect(tableComponent.displayedColumns).toEqual(component.displayedColumns);
  });
});

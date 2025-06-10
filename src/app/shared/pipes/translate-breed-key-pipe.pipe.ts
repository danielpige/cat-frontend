import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translateBreedKeyPipe',
})
export class TranslateBreedKeyPipePipe implements PipeTransform {
  private translations: { [key: string]: string } = {
    'weight': 'Peso',
    'id': 'ID',
    'name': 'Nombre',
    'cfa_url': 'CFA',
    'vetstreet_url': 'VetStreet',
    'vcahospitals_url': 'VCA Hospitals',
    'temperament': 'Temperamento',
    'origin': 'Origen',
    'country_codes': 'Códigos de País',
    'country_code': 'Código de País',
    'description': 'Descripción',
    'life_span': 'Esperanza de vida',
    'indoor': 'Interior',
    'lap': 'Le gusta estar en el regazo',
    'alt_names': 'Nombres alternativos',
    'adaptability': 'Adaptabilidad',
    'affection_level': 'Nivel de afecto',
    'child_friendly': 'Amigable con niños',
    'dog_friendly': 'Amigable con perros',
    'energy_level': 'Nivel de energía',
    'grooming': 'Necesita cuidados',
    'health_issues': 'Problemas de salud',
    'intelligence': 'Inteligencia',
    'shedding_level': 'Nivel de muda',
    'social_needs': 'Necesidades sociales',
    'stranger_friendly': 'Amigable con extraños',
    'vocalisation': 'Vocalización',
    'experimental': 'Experimental',
    'hairless': 'Sin pelo',
    'natural': 'Natural',
    'rare': 'Raro',
    'rex': 'Rex',
    'suppressed_tail': 'Cola corta',
    'short_legs': 'Patas cortas',
    'wikipedia_url': 'Wikipedia',
    'hypoallergenic': 'Hipoalergénico',
    'reference_image_id': 'ID imagen de referencia',
    'weight.imperial': 'Peso imperial',
    'weight.metric': 'Peso métrico',
  };

  transform(key: string): string {
    return this.translations[key] || key;
  }
}

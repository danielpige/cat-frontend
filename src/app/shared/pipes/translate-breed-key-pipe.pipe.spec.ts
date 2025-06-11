import { TranslateBreedKeyPipePipe } from './translate-breed-key-pipe.pipe';

describe('TranslateBreedKeyPipePipe', () => {
  let pipe: TranslateBreedKeyPipePipe;

  beforeEach(() => {
    pipe = new TranslateBreedKeyPipePipe();
  });

  it('debería crear una instancia del pipe', () => {
    expect(pipe).toBeTruthy();
  });

  it('debería traducir claves conocidas correctamente', () => {
    expect(pipe.transform('weight')).toBe('Peso');
    expect(pipe.transform('origin')).toBe('Origen');
    expect(pipe.transform('child_friendly')).toBe('Amigable con niños');
    expect(pipe.transform('weight.metric')).toBe('Peso métrico');
  });

  it('debería devolver la clave original si no existe traducción', () => {
    expect(pipe.transform('unknown_key')).toBe('unknown_key');
    expect(pipe.transform('')).toBe('');
    expect(pipe.transform('breed_color')).toBe('breed_color');
  });
});

import { TestBed } from '@angular/core/testing';
import { EncryptionService } from './encription.service';

describe('EncryptionService', () => {
  let servicio: EncryptionService;
  const claveDePrueba = 'clavePrueba';
  const valorDePrueba = 'valorPrueba';

  beforeEach(() => {
    TestBed.configureTestingModule({});
    servicio = TestBed.inject(EncryptionService);
    localStorage.clear(); // Limpiar antes de cada prueba
  });

  it('debería crearse correctamente', () => {
    expect(servicio).toBeTruthy();
  });

  it('debería encriptar y desencriptar un valor correctamente', () => {
    const encriptado = servicio.encrypt(valorDePrueba);
    expect(encriptado).toBeTruthy();
    const desencriptado = servicio.decrypt(encriptado);
    expect(desencriptado).toEqual(valorDePrueba);
  });

  it('debería guardar y recuperar un valor encriptado desde localStorage', () => {
    servicio.setEncryptedItem(claveDePrueba, valorDePrueba);
    const recuperado = servicio.getDecryptedItem(claveDePrueba);
    expect(recuperado).toEqual(valorDePrueba);
  });

  it('debería devolver null si la clave no existe en localStorage', () => {
    const resultado = servicio.getDecryptedItem('claveInexistente');
    expect(resultado).toBeNull();
  });

  it('debería eliminar un valor encriptado de localStorage', () => {
    servicio.setEncryptedItem(claveDePrueba, valorDePrueba);
    servicio.removeEncryptedItem(claveDePrueba);
    const resultado = servicio.getDecryptedItem(claveDePrueba);
    expect(resultado).toBeNull();
  });

  it('debería devolver una cadena vacía si falla la desencriptación', () => {
    const textoInvalido = 'esto_no_es_un_texto_encriptado_valido';
    const resultado = servicio.decrypt(textoInvalido);
    expect(resultado).toEqual('');
  });
});

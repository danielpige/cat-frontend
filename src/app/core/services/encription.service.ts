import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class EncryptionService {
  private readonly secretKey = 'S3CR3TK3Y*';

  // AES Encrypts a value
  encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, this.secretKey).toString();
  }

  // AES Decrypts a value
  decrypt(ciphertext: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(ciphertext, this.secretKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (err) {
      console.error('Error al desencriptar:', err);
      return '';
    }
  }

  // Creates a deterministic hash (SHA256) for the key
  private hashKey(key: string): string {
    return CryptoJS.SHA256(key).toString();
  }

  // Stores the encrypted value under a hashed key
  setEncryptedItem(key: string, value: string): void {
    const hashedKey = this.hashKey(key); // 👈 clave determinista
    const encryptedValue = this.encrypt(value);
    localStorage.setItem(hashedKey, encryptedValue);
  }

  // Retrieves and decrypts the value
  getDecryptedItem(key: string): string | null {
    const hashedKey = this.hashKey(key); // 👈 misma lógica que arriba
    const encryptedValue = localStorage.getItem(hashedKey);
    if (!encryptedValue) return null;
    return this.decrypt(encryptedValue);
  }

  // Removes an item by hashed key
  removeEncryptedItem(key: string): void {
    const hashedKey = this.hashKey(key);
    localStorage.removeItem(hashedKey);
  }
}


declare module 'shamirs-secret-sharing' {
    export interface SplitOptions {
      shares: number; // Total number of shares to generate
      threshold: number; // Minimum number of shares required to reconstruct the secret
    }
  
    export function split(secret: Buffer, options: SplitOptions): Buffer[];
    export function combine(shares: Buffer[]): Buffer;
  }
  
declare module 'spacetime:sys@2.0' {
  // Minimal type declarations to satisfy TypeScript during spacetime publish.
  // The actual types are provided by the SpacetimeDB runtime.
  export type u16 = number;
  export type u32 = number;
  export type u128 = bigint;
  export type u256 = bigint;

  export interface ModuleHooks {
    // Use index signature to avoid having to model all hooks.
    [key: string]: unknown;
  }

  export interface ModuleDefaultExport {
    [key: string]: unknown;
  }

  export const moduleHooks: ModuleHooks;
}

declare module 'object-inspect';
declare module 'statuses';


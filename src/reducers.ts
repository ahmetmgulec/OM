/**
 * Re-export reducers with type assertion to work around spacetimedb SDK
 * type mismatch (updateIpAddress in schema type inference).
 */
import { reducers } from './module_bindings';

// Cast through unknown to fully break the type chain from ConvertToAccessorMap
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const typedReducers = reducers as unknown as Record<string, any>;

/**
 * @module @lenguados/math2d/pool
 * @description Object pooling system for reducing allocations and GC pressure
 *
 * This module provides generic object pools and pre-configured pools
 * for all core math types to improve performance in allocation-heavy
 * scenarios like physics simulations.
 */

export * from './object-pool';
export * from './pooled-types';

import { describe, it, expectTypeOf } from 'vitest';
import type { HasOnlyOneKey } from '../../../src/types/utils/HasOnlyOneKey';

describe('HasOnlyOneKey', () => {
    it('should return true for record with single string key', () => {
        type Result = HasOnlyOneKey<{ a: string }>;
        expectTypeOf<Result>().toEqualTypeOf<true>();
    });

    it('should return true for record with single number key', () => {
        type Result = HasOnlyOneKey<{ 1: string }>;
        expectTypeOf<Result>().toEqualTypeOf<true>();
    });

    it('should return true for record with single symbol key', () => {
        const sym = Symbol('test');
        type Result = HasOnlyOneKey<{ [sym]: string }>;
        expectTypeOf<Result>().toEqualTypeOf<true>();
    });

    it('should return false for record with two keys', () => {
        type Result = HasOnlyOneKey<{ a: string; b: number }>;
        expectTypeOf<Result>().toEqualTypeOf<false>();
    });

    it('should return false for record with multiple number keys', () => {
        type Result = HasOnlyOneKey<{ 1: string; 2: number }>;
        expectTypeOf<Result>().toEqualTypeOf<false>();
    });

    it('should return false for record with many keys', () => {
        type Result = HasOnlyOneKey<{
            a: string;
            b: number;
            c: boolean;
            d: null
        }>;
        expectTypeOf<Result>().toEqualTypeOf<false>();
    });

    it('should work with complex value types', () => {
        type ComplexType = { nested: { deep: { value: string } } };
        type Result = HasOnlyOneKey<{ only: ComplexType }>;
        expectTypeOf<Result>().toEqualTypeOf<true>();
    });

    it('should return true for record with single key regardless of value type', () => {
        type Result1 = HasOnlyOneKey<{ x: undefined }>;
        type Result2 = HasOnlyOneKey<{ x: null }>;
        type Result3 = HasOnlyOneKey<{ x: never }>;
        type Result4 = HasOnlyOneKey<{ x: unknown }>;
        type Result5 = HasOnlyOneKey<{ x: any }>;

        expectTypeOf<Result1>().toEqualTypeOf<true>();
        expectTypeOf<Result2>().toEqualTypeOf<true>();
        expectTypeOf<Result3>().toEqualTypeOf<true>();
        expectTypeOf<Result4>().toEqualTypeOf<true>();
        expectTypeOf<Result5>().toEqualTypeOf<true>();
    });

    it('should work with mixed key types', () => {
        type Result = HasOnlyOneKey<Record<string, string> & Record<number, number>>;
        // This should be false as it has multiple index signatures
        expectTypeOf<Result>().toEqualTypeOf<false>();
    });

    it('should handle optional properties correctly', () => {
        type Result1 = HasOnlyOneKey<{ a?: string }>;
        type Result2 = HasOnlyOneKey<{ a?: string; b?: number }>;

        expectTypeOf<Result1>().toEqualTypeOf<true>();
        expectTypeOf<Result2>().toEqualTypeOf<false>();
    });
});

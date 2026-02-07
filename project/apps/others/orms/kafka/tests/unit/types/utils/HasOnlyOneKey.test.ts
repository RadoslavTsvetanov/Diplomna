import { describe, it, expectTypeOf } from 'vitest';
import type { HasOnlyOneKey } from '../../../src/types/utils/HasOnlyOneKey';
import { TopicClient } from '../../../src/TopicClient';
import type { TopicSchemaDefault } from '../../../src/types/TopicSchema';

describe('HasOnlyOneKey with TopicClient', () => {
    it('should return true for TopicClient with single version', () => {
        type SingleVersionSchema = { v1: { userId: string; email: string } };
        type Result = HasOnlyOneKey<SingleVersionSchema>;
        expectTypeOf<Result>().toEqualTypeOf<true>();
        
        // Test with actual TopicClient
        const client = new TopicClient({ v1: { userId: "", email: "" } });
        expectTypeOf<typeof client>().toMatchTypeOf<TopicClient<SingleVersionSchema>>();
    });

    it('should return false for TopicClient with multiple versions', () => {
        type MultiVersionSchema = { 
            v1: { userId: string }; 
            v2: { userId: string; email: string } 
        };
        type Result = HasOnlyOneKey<MultiVersionSchema>;
        expectTypeOf<Result>().toEqualTypeOf<false>();
        
        // Test with actual TopicClient
        const client = new TopicClient({ 
            v1: { userId: "" }, 
            v2: { userId: "", email: "" } 
        });
        expectTypeOf<typeof client>().toMatchTypeOf<TopicClient<MultiVersionSchema>>();
    });

    it('should return true for single v1 schema', () => {
        type Schema = { v1: { id: string; name: string; age: number } };
        type Result = HasOnlyOneKey<Schema>;
        expectTypeOf<Result>().toEqualTypeOf<true>();
    });

    it('should return false for v1 and v2 schema', () => {
        type Schema = { 
            v1: { id: string }; 
            v2: { id: string; name: string } 
        };
        type Result = HasOnlyOneKey<Schema>;
        expectTypeOf<Result>().toEqualTypeOf<false>();
    });

    it('should return false for three versions', () => {
        type Schema = { 
            v1: { id: string }; 
            v2: { id: string; name: string };
            v3: { id: string; name: string; email: string }
        };
        type Result = HasOnlyOneKey<Schema>;
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

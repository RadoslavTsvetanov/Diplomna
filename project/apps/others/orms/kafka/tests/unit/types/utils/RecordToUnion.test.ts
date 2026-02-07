import { describe, it, expectTypeOf } from 'vitest';
import type { RecordToUnion } from '../../../src/types/utils/RecordToUnion.js';

describe('RecordToUnion', () => {
    it('should convert record to union with version and value', () => {
        type User = { id: string; name: string };
        type Order = { orderId: string; total: number };

        type Result = RecordToUnion<{ a: User; b: Order }>;

        type Expected =
            | { version: "a"; value: User }
            | { version: "b"; value: Order };

        expectTypeOf<Result>().toEqualTypeOf<Expected>();
    });

    it('should work with single entry', () => {
        type User = { id: string };

        type Result = RecordToUnion<{ 1: User }>;

        type Expected = { version: "1"; value: User };

        expectTypeOf<Result>().toEqualTypeOf<Expected>();
    });

    it('should work with number keys', () => {
        type V1 = { userId: string };
        type V2 = { userId: string; email: string };

        type Result = RecordToUnion<{ 1: V1; 2: V2 }>;

        type Expected =
            | { version: "1"; value: V1 }
            | { version: "2"; value: V2 };

        expectTypeOf<Result>().toEqualTypeOf<Expected>();
    });

    it('should preserve exact value types', () => {
        type Schema1 = { name: string; age: number };
        type Schema2 = { name: string; age: number; email: string };

        type Result = RecordToUnion<{ v1: Schema1; v2: Schema2 }>;

        type Expected =
            | { version: "v1"; value: Schema1 }
            | { version: "v2"; value: Schema2 };

        expectTypeOf<Result>().toEqualTypeOf<Expected>();
    });

    it('should work with complex nested types', () => {
        type DeepType = {
            user: {
                profile: {
                    name: string;
                    settings: { theme: 'light' | 'dark' }
                }
            }
        };

        type Result = RecordToUnion<{ deep: DeepType }>;

        type Expected = { version: "deep"; value: DeepType };

        expectTypeOf<Result>().toEqualTypeOf<Expected>();
    });

    it('should create union with multiple versions', () => {
        type V1 = { id: string };
        type V2 = { id: string; name: string };
        type V3 = { id: string; name: string; email: string };

        type Result = RecordToUnion<{ 1: V1; 2: V2; 3: V3 }>;

        type Expected =
            | { version: "1"; value: V1 }
            | { version: "2"; value: V2 }
            | { version: "3"; value: V3 };

        expectTypeOf<Result>().toEqualTypeOf<Expected>();
    });

    it('should preserve literal types in values', () => {
        type Event1 = { type: 'create'; data: string };
        type Event2 = { type: 'update'; data: number };

        type Result = RecordToUnion<{ create: Event1; update: Event2 }>;

        type Expected =
            | { version: "create"; value: Event1 }
            | { version: "update"; value: Event2 };

        expectTypeOf<Result>().toEqualTypeOf<Expected>();
    });

    it('should work with empty object values', () => {
        type Empty = {};

        type Result = RecordToUnion<{ empty: Empty }>;

        type Expected = { version: "empty"; value: Empty };

        expectTypeOf<Result>().toEqualTypeOf<Expected>();
    });

    it('should work with optional properties in values', () => {
        type OptionalSchema = { id: string; name?: string };

        type Result = RecordToUnion<{ v1: OptionalSchema }>;

        type Expected = { version: "v1"; value: OptionalSchema };

        expectTypeOf<Result>().toEqualTypeOf<Expected>();
    });

    it('should maintain discriminated union properties', () => {
        type Success = { status: 'success'; data: string };
        type Error = { status: 'error'; error: string };

        type Result = RecordToUnion<{ ok: Success; err: Error }>;

        type Expected =
            | { version: "ok"; value: Success }
            | { version: "err"; value: Error };

        expectTypeOf<Result>().toEqualTypeOf<Expected>();
    });

    it('should work with records containing array types', () => {
        type Schema = { items: string[]; count: number };

        type Result = RecordToUnion<{ list: Schema }>;

        type Expected = { version: "list"; value: Schema };

        expectTypeOf<Result>().toEqualTypeOf<Expected>();
    });

    it('should handle readonly properties', () => {
        type ReadonlySchema = { readonly id: string; readonly value: number };

        type Result = RecordToUnion<{ v1: ReadonlySchema }>;

        type Expected = { version: "v1"; value: ReadonlySchema };

        expectTypeOf<Result>().toEqualTypeOf<Expected>();
    });

    it('should work with union types in values', () => {
        type Schema = { value: string | number | boolean };

        type Result = RecordToUnion<{ multi: Schema }>;

        type Expected = { version: "multi"; value: Schema };

        expectTypeOf<Result>().toEqualTypeOf<Expected>();
    });

    it('should preserve index signatures', () => {
        type DynamicSchema = { [key: string]: unknown; id: string };

        type Result = RecordToUnion<{ dynamic: DynamicSchema }>;

        type Expected = { version: "dynamic"; value: DynamicSchema };

        expectTypeOf<Result>().toEqualTypeOf<Expected>();
    });
});

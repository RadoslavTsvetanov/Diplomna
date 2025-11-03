import { describe, it, expectTypeOf } from 'vitest';
import { InferParamType } from '@';

describe('InferParamType', () => {
  describe('Number type inference ($ suffix)', () => {
    it('should infer number type for parameters ending with $', () => {
      expectTypeOf<InferParamType<'id$'>>().toEqualTypeOf<number>();
      expectTypeOf<InferParamType<'age$'>>().toEqualTypeOf<number>();
      expectTypeOf<InferParamType<'count$'>>().toEqualTypeOf<number>();
      
      
      expectTypeOf<InferParamType<'price$'>>().toEqualTypeOf<number>();
    });

    it('should handle optional number parameters', () => {
      expectTypeOf<InferParamType<'?id$'>>().toEqualTypeOf<number>();
      expectTypeOf<InferParamType<'?count$'>>().toEqualTypeOf<number>();
    });
  });

  describe('Date type inference (( suffix)', () => {
    it('should infer Date type for parameters ending with (', () => {
      expectTypeOf<InferParamType<'createdAt('>>().toEqualTypeOf<Date>();
      expectTypeOf<InferParamType<'updatedAt('>>().toEqualTypeOf<Date>();
      expectTypeOf<InferParamType<'date('>>().toEqualTypeOf<Date>();
      expectTypeOf<InferParamType<'timestamp('>>().toEqualTypeOf<Date>();
    });

    it('should handle optional date parameters', () => {
      expectTypeOf<InferParamType<'?date('>>().toEqualTypeOf<Date>();
      expectTypeOf<InferParamType<'?timestamp('>>().toEqualTypeOf<Date>();
    });
  });

  describe('Boolean type inference (^ suffix)', () => {
    it('should infer boolean type for parameters ending with ^', () => {
      expectTypeOf<InferParamType<'active^'>>().toEqualTypeOf<boolean>();
      expectTypeOf<InferParamType<'enabled^'>>().toEqualTypeOf<boolean>();
      expectTypeOf<InferParamType<'isPublic^'>>().toEqualTypeOf<boolean>();
      expectTypeOf<InferParamType<'verified^'>>().toEqualTypeOf<boolean>();
    });

    it('should handle optional boolean parameters', () => {
      expectTypeOf<InferParamType<'?active^'>>().toEqualTypeOf<boolean>();
      expectTypeOf<InferParamType<'?enabled^'>>().toEqualTypeOf<boolean>();
    });
  });

  describe('String type inference (default)', () => {
    it('should infer string type for parameters without special suffix', () => {
      expectTypeOf<InferParamType<'name'>>().toEqualTypeOf<string>();
      expectTypeOf<InferParamType<'username'>>().toEqualTypeOf<string>();
      expectTypeOf<InferParamType<'email'>>().toEqualTypeOf<string>();
      expectTypeOf<InferParamType<'slug'>>().toEqualTypeOf<string>();
    });

    it('should handle optional string parameters', () => {
      expectTypeOf<InferParamType<'?name'>>().toEqualTypeOf<string>();
      expectTypeOf<InferParamType<'?email'>>().toEqualTypeOf<string>();
    });
  });

  describe('Edge cases', () => {
    it('should handle parameters with multiple special characters', () => {
      // Only the last character should determine the type
      expectTypeOf<InferParamType<'param$^'>>().toEqualTypeOf<boolean>();
      expectTypeOf<InferParamType<'param^$'>>().toEqualTypeOf<number>();
    });

    it('should handle empty-like parameters', () => {
      expectTypeOf<InferParamType<'$'>>().toEqualTypeOf<number>();
      expectTypeOf<InferParamType<'('>>().toEqualTypeOf<Date>();
      expectTypeOf<InferParamType<'^'>>().toEqualTypeOf<boolean>();
    });
  });
});

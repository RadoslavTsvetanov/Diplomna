import { describe, it, expectTypeOf } from 'vitest';
import type { ContainsAtTheEnd, ContainsAtTheStart, RemoveNonAlphabetic } from '@/';

describe('ContainsAtTheEnd', () => {
  it('should return true when string ends with the specified suffix', () => {
    expectTypeOf<ContainsAtTheEnd<'hello$', '$'>>().toEqualTypeOf<true>();
    expectTypeOf<ContainsAtTheEnd<'world(', '('>>().toEqualTypeOf<true>();
    expectTypeOf<ContainsAtTheEnd<'test^', '^'>>().toEqualTypeOf<true>();
    expectTypeOf<ContainsAtTheEnd<'param$', '$'>>().toEqualTypeOf<true>();
  });

  it('should return false when string does not end with the specified suffix', () => {
    expectTypeOf<ContainsAtTheEnd<'hello', '$'>>().toEqualTypeOf<false>();
    expectTypeOf<ContainsAtTheEnd<'$world', '$'>>().toEqualTypeOf<false>();
    expectTypeOf<ContainsAtTheEnd<'test', '^'>>().toEqualTypeOf<false>();
    expectTypeOf<ContainsAtTheEnd<'param', '('>>().toEqualTypeOf<false>();
  });

  it('should handle empty strings', () => {
    expectTypeOf<ContainsAtTheEnd<'', '$'>>().toEqualTypeOf<false>();
  });

  it('should handle multi-character suffixes', () => {
    expectTypeOf<ContainsAtTheEnd<'hello_world', 'world'>>().toEqualTypeOf<true>();
    expectTypeOf<ContainsAtTheEnd<'test_case', 'case'>>().toEqualTypeOf<true>();
    expectTypeOf<ContainsAtTheEnd<'hello', 'world'>>().toEqualTypeOf<false>();
  });
});

describe('ContainsAtTheStart', () => {
  it('should return true when string starts with the specified prefix', () => {
    expectTypeOf<ContainsAtTheStart<'?optional', '?'>>().toEqualTypeOf<true>();
    expectTypeOf<ContainsAtTheStart<'?param', '?'>>().toEqualTypeOf<true>();
    expectTypeOf<ContainsAtTheStart<':param', ':'>>().toEqualTypeOf<true>();
  });

  it('should return false when string does not start with the specified prefix', () => {
    expectTypeOf<ContainsAtTheStart<'hello', '?'>>().toEqualTypeOf<false>();
    expectTypeOf<ContainsAtTheStart<'world?', '?'>>().toEqualTypeOf<false>();
    expectTypeOf<ContainsAtTheStart<'test', ':'>>().toEqualTypeOf<false>();
  });

  it('should handle empty strings', () => {
    expectTypeOf<ContainsAtTheStart<'', '?'>>().toEqualTypeOf<false>();
  });

  it('should handle multi-character prefixes', () => {
    expectTypeOf<ContainsAtTheStart<'hello_world', 'hello'>>().toEqualTypeOf<true>();
    expectTypeOf<ContainsAtTheStart<'test_case', 'test'>>().toEqualTypeOf<true>();
    expectTypeOf<ContainsAtTheStart<'world', 'hello'>>().toEqualTypeOf<false>();
  });
});

describe('RemoveNonAlphabetic', () => {
  it('should remove all non-alphabetic characters', () => {
    expectTypeOf<RemoveNonAlphabetic<'hello123'>>().toEqualTypeOf<'hello'>();
    expectTypeOf<RemoveNonAlphabetic<'test$'>>().toEqualTypeOf<'test'>();
    expectTypeOf<RemoveNonAlphabetic<'param^'>>().toEqualTypeOf<'param'>();
    expectTypeOf<RemoveNonAlphabetic<'date('>>().toEqualTypeOf<'date'>();
  });

  it('should handle strings with multiple non-alphabetic characters', () => {
    expectTypeOf<RemoveNonAlphabetic<'?param$'>>().toEqualTypeOf<'param'>();
    expectTypeOf<RemoveNonAlphabetic<'123abc456'>>().toEqualTypeOf<'abc'>();
    expectTypeOf<RemoveNonAlphabetic<'!@#test$%^'>>().toEqualTypeOf<'test'>();
  });

  it('should preserve mixed case alphabetic characters', () => {
    expectTypeOf<RemoveNonAlphabetic<'HelloWorld'>>().toEqualTypeOf<'HelloWorld'>();
    expectTypeOf<RemoveNonAlphabetic<'TestCase123'>>().toEqualTypeOf<'TestCase'>();
  });

  it('should return empty string for non-alphabetic input', () => {
    expectTypeOf<RemoveNonAlphabetic<'123'>>().toEqualTypeOf<''>();
    expectTypeOf<RemoveNonAlphabetic<'$%^'>>().toEqualTypeOf<''>();
    expectTypeOf<RemoveNonAlphabetic<''>>().toEqualTypeOf<''>();
  });

  it('should handle strings with spaces and special characters', () => {
    expectTypeOf<RemoveNonAlphabetic<'hello world'>>().toEqualTypeOf<'helloworld'>();
    expectTypeOf<RemoveNonAlphabetic<'test-case'>>().toEqualTypeOf<'testcase'>();
    expectTypeOf<RemoveNonAlphabetic<'param_name'>>().toEqualTypeOf<'paramname'>();
  });
});

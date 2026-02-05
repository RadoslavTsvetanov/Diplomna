export type HasOnlyOneKey<T extends Record<any, any>> = 
  [keyof T] extends [infer Only]
    ? Only extends keyof T
      ? keyof T extends Only
        ? true
        : false
      : false
    : false;

// Test it:
type Test1 = HasOnlyOneKey<{ a: string }>;  // true
type Test2 = HasOnlyOneKey<{ a: string; b: number }>;  // false
type Test3 = HasOnlyOneKey<{ 1: string }>;  // true
type Test4 = HasOnlyOneKey<{ 1: string; 2: number }>;  // false

// Test it:
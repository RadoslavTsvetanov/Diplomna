
import z from "zod/v4";
import { Without } from "../src/main";

type Expect<T extends true> = T;
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
    ? true
    : false;

// Test 1: Basic key removal
{
    const original = z.object({
        name: z.string(),
        age: z.number(),
        email: z.string()
    });

    const result = Without(original, ["age"]);
    type Result = z.infer<typeof result>;

    type Expected = {
        name: string;
        email: string;
    };

    type Test = Expect<Equal<Result, Expected>>;
}

// Test 2: Multiple key removal
{
    const original = z.object({
        id: z.number(),
        name: z.string(),
        age: z.number(),
        email: z.string(),
        phone: z.string()
    });

    const result = Without(original, ["age", "phone"]);
    type Result = z.infer<typeof result>;

    type Expected = {
        id: number;
        name: string;
        email: string;
    };

    type Test = Expect<Equal<Result, Expected>>;
}

// Test 3: Optional fields remain optional
{
    const original = z.object({
        required: z.string(),
        optional: z.string().optional(),
        toRemove: z.number()
    });

    const result = Without(original, ["toRemove"]);
    type Result = z.infer<typeof result>;

    type Expected = {
        required: string;
        optional?: string | undefined;
    };

    type Test = Expect<Equal<Result, Expected>>;
}

// Test 4: No keys removed (empty array)
{
    const original = z.object({
        name: z.string(),
        age: z.number()
    });

    const result = Without(original, []);
    type Result = z.infer<typeof result>;

    type Expected = {
        name: string;
        age: number;
    };

    type Test = Expect<Equal<Result, Expected>>;
}

// Test 5: Nested objects are preserved
{
    const original = z.object({
        id: z.number(),
        user: z.object({
            name: z.string(),
            email: z.string()
        }),
        metadata: z.record(z.string())
    });

    const result = Without(original, ["metadata"]);
    type Result = z.infer<typeof result>;

    type Expected = {
        id: number;
        user: {
            name: string;
            email: string;
        };
    };

    type Test = Expect<Equal<Result, Expected>>;
}

// Test 6: Array types are preserved
{
    const original = z.object({
        items: z.array(z.string()),
        count: z.number(),
        tags: z.array(z.string())
    });

    const result = Without(original, ["tags"]);
    type Result = z.infer<typeof result>;

    type Expected = {
        items: string[];
        count: number;
    };

    type Test = Expect<Equal<Result, Expected>>;
}

// Test 7: Union types are preserved
{
    const original = z.object({
        type: z.union([z.literal("user"), z.literal("admin")]),
        name: z.string(),
        password: z.string()
    });

    const result = Without(original, ["password"]);
    type Result = z.infer<typeof result>;

    type Expected = {
        type: "user" | "admin";
        name: string;
    };

    type Test = Expect<Equal<Result, Expected>>;
}

// Test 8: Only valid keys can be removed (type safety)
{
    const original = z.object({
        name: z.string(),
        age: z.number()
    });

    // This should be type-safe - only "name" and "age" are valid
    const result1 = Without(original, ["age"]);
    const result2 = Without(original, ["name"]);
    const result3 = Without(original, ["name", "age"]);

    // @ts-expect-error - "invalid" is not a valid key
    const result4 = Without(original, ["invalid"]);

    // @ts-expect-error - "nonexistent" is not a valid key
    const result5 = Without(original, ["age", "nonexistent"]);
}

// Test 9: Chaining Without operations
{
    const original = z.object({
        a: z.string(),
        b: z.number(),
        c: z.boolean(),
        d: z.string()
    });

    const step1 = Without(original, ["b"]);
    const step2 = Without(step1, ["d"]);

    type Result = z.infer<typeof step2>;
    type Expected = {
        a: string;
        c: boolean;
    };

    type Test = Expect<Equal<Result, Expected>>;
}

// Test 10: Default values are handled correctly
{
    const original = z.object({
        name: z.string(),
        count: z.number().default(0),
        active: z.boolean().default(true),
        toRemove: z.string()
    });

    const result = Without(original, ["toRemove"]);
    type Result = z.infer<typeof result>;

    type Expected = {
        name: string;
        count: number;
        active: boolean;
    };

    type Test = Expect<Equal<Result, Expected>>;
}

// Test 11: All keys can be removed
{
    const original = z.object({
        a: z.string(),
        b: z.number()
    });

    const result = Without(original, ["a", "b"]);
    type Result = z.infer<typeof result>;

    type Expected = {};

    type Test = Expect<Equal<Result, Expected>>;
}

// Test 12: Complex nested scenario
{
    const original = z.object({
        id: z.string(),
        profile: z.object({
            firstName: z.string(),
            lastName: z.string(),
            contacts: z.array(z.object({
                type: z.string(),
                value: z.string()
            }))
        }),
        settings: z.record(z.unknown()),
        privateKey: z.string()
    });

    const result = Without(original, ["privateKey", "settings"]);
    type Result = z.infer<typeof result>;

    type Expected = {
        id: string;
        profile: {
            firstName: string;
            lastName: string;
            contacts: Array<{
                type: string;
                value: string;
            }>;
        };
    };

    type Test = Expect<Equal<Result, Expected>>;
}

console.log("✓ All type tests passed!");

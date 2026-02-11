import z from "zod/v4";
import { mergeObjects } from "../src/mergeObjects";

type Expect<T extends true> = T;
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
    ? true
    : false;

// Test 1: Basic merge with non-overlapping keys
{
    const schema1 = z.object({
        name: z.string(),
        age: z.number()
    });

    const schema2 = z.object({
        email: z.string(),
        phone: z.string()
    });

    const merged = mergeObjects(schema1, schema2);
    type Result = z.infer<typeof merged>;

    type Expected = {
        name: string;
        age: number;
        email: string;
        phone: string;
    };

    type Test = Expect<Equal<Result, Expected>>;
}

// Test 2: Merge with overlapping keys (second schema overrides)
{
    const schema1 = z.object({
        name: z.string(),
        age: z.number()
    });

    const schema2 = z.object({
        age: z.string(), // Override: number -> string
        email: z.string()
    });

    const merged = mergeObjects(schema1, schema2);
    type Result = z.infer<typeof merged>;

    type Expected = {
        name: string;
        age: string; // Overridden to string
        email: string;
    };

    type Test = Expect<Equal<Result, Expected>>;
}

// Test 3: Merge with optional properties
{
    const schema1 = z.object({
        name: z.string(),
        age: z.number().optional()
    });

    const schema2 = z.object({
        email: z.string(),
        phone: z.string().optional()
    });

    const merged = mergeObjects(schema1, schema2);
    type Result = z.infer<typeof merged>;

    type Expected = {
        name: string;
        age?: number;
        email: string;
        phone?: string;
    };

    type Test = Expect<Equal<Result, Expected>>;
}


// Future tests to remind me 
// Test 4: Override optional with required
{
    const schema1 = z.object({
        name: z.string(),
        age: z.number().optional()
    });

    const schema2 = z.object({
        age: z.number() // Required
    });

    const merged = mergeObjects(schema1, schema2);
    type Result = z.infer<typeof merged>;

    type Expected = {
        name: string;
        age: number; // Now required
    };

    type Test = Expect<Equal<Result, Expected>>;
}

// Test 5: Override required with optional
{
    const schema1 = z.object({
        name: z.string(),
        age: z.number()
    });

    const schema2 = z.object({
        age: z.number().optional()
    });

    const merged = mergeObjects(schema1, schema2);
    type Result = z.infer<typeof merged>;

    type Expected = {
        name: string;
        age?: number; // Now optional
    };

    type Test = Expect<Equal<Result, Expected>>;
}

// Test 6: Merge with nested objects
{
    const schema1 = z.object({
        user: z.object({
            name: z.string()
        }),
        id: z.number()
    });

    const schema2 = z.object({
        user: z.object({
            email: z.string()
        }),
        metadata: z.object({
            createdAt: z.date()
        })
    });

    const merged = mergeObjects(schema1, schema2);
    type Result = z.infer<typeof merged>;

    // Note: The nested user object is completely replaced, not merged
    type Expected = {
        id: number;
        user: {
            email: string; // Only schema2's user shape
        };
        metadata: {
            createdAt: Date;
        };
    };

    type Test = Expect<Equal<Result, Expected>>;
}

// Test 7: Merge with arrays
{
    const schema1 = z.object({
        name: z.string(),
        tags: z.array(z.string())
    });

    const schema2 = z.object({
        email: z.string(),
        numbers: z.array(z.number())
    });

    const merged = mergeObjects(schema1, schema2);
    type Result = z.infer<typeof merged>;

    type Expected = {
        name: string;
        tags: string[];
        email: string;
        numbers: number[];
    };

    type Test = Expect<Equal<Result, Expected>>;
}

// Test 8: Merge with unions and literals
{
    const schema1 = z.object({
        status: z.union([z.literal("active"), z.literal("inactive")])
    });

    const schema2 = z.object({
        role: z.enum(["admin", "user", "guest"])
    });

    const merged = mergeObjects(schema1, schema2);
    type Result = z.infer<typeof merged>;

    type Expected = {
        status: "active" | "inactive";
        role: "admin" | "user" | "guest";
    };

    type Test = Expect<Equal<Result, Expected>>;
}

// Test 9: Merge with empty schema
{
    const schema1 = z.object({
        name: z.string(),
        age: z.number()
    });

    const schema2 = z.object({});

    const merged = mergeObjects(schema1, schema2);
    type Result = z.infer<typeof merged>;

    type Expected = {
        name: string;
        age: number;
    };

    type Test = Expect<Equal<Result, Expected>>;
}

// Test 10: Merge two empty schemas
{
    const schema1 = z.object({});
    const schema2 = z.object({});

    const merged = mergeObjects(schema1, schema2);
    type Result = z.infer<typeof merged>;

    type Expected = {};

    type Test = Expect<Equal<Result, Expected>>;
}

// Test 11: Complex merge with multiple types
{
    const schema1 = z.object({
        id: z.string().uuid(),
        name: z.string().min(2),
        age: z.number().positive(),
        tags: z.array(z.string()),
        metadata: z.record(z.string())
    });

    const schema2 = z.object({
        email: z.string().email(),
        age: z.number().max(100), // Override
        verified: z.boolean(),
        preferences: z.object({
            theme: z.enum(["light", "dark"]),
            notifications: z.boolean()
        })
    });

    const merged = mergeObjects(schema1, schema2);
    type Result = z.infer<typeof merged>;

    type Expected = {
        id: string;
        name: string;
        age: number; // Overridden constraint
        tags: string[];
        metadata: Record<string, string>;
        email: string;
        verified: boolean;
        preferences: {
            theme: "light" | "dark";
            notifications: boolean;
        };
    };

    type Test = Expect<Equal<Result, Expected>>;
}

// Test 12: Merge with default values
{
    const schema1 = z.object({
        name: z.string(),
        role: z.string().default("user")
    });

    const schema2 = z.object({
        email: z.string(),
        active: z.boolean().default(true)
    });

    const merged = mergeObjects(schema1, schema2);
    type Result = z.infer<typeof merged>;

    type Expected = {
        name: string;
        role: string;
        email: string;
        active: boolean;
    };

    type Test = Expect<Equal<Result, Expected>>;
}

// Test 13: Ensure type safety - shouldn't allow non-object schemas
{
    const schema1 = z.object({
        name: z.string()
    });

    // @ts-expect-error - should not accept non-object schema
    const invalid1 = mergeObjects(schema1, z.string());

    // @ts-expect-error - should not accept non-object schema
    const invalid2 = mergeObjects(z.number(), schema1);

    // @ts-expect-error - should not accept array schema
    const invalid3 = mergeObjects(schema1, z.array(z.string()));
}

// Test 14: Readonly and readonly arrays
{
    const schema1 = z.object({
        name: z.string(),
        readonly: z.string().readonly()
    });

    const schema2 = z.object({
        items: z.array(z.number()).readonly()
    });

    const merged = mergeObjects(schema1, schema2);
    type Result = z.infer<typeof merged>;

    // Zod's readonly creates readonly types
    type Expected = {
        name: string;
        readonly: string;
        items: readonly number[];
    };

    type Test = Expect<Equal<Result, Expected>>;
}

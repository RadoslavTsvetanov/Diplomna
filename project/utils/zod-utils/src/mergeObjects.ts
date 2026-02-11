import z from "zod/v4";

/**
 * Merges two Zod object schemas together, combining their properties.
 * Properties from the second schema will override properties from the first schema if they have the same key.
 * 
 * @param schema1 - The first Zod object schema
 * @param schema2 - The second Zod object schema (takes precedence on key conflicts)
 * @returns A new Zod object schema with merged properties
 * 
 * @example
 * const base = z.object({ name: z.string(), age: z.number() });
 * const extra = z.object({ email: z.string(), age: z.string() });
 * const merged = mergeObjects(base, extra);
 * // Result: { name: string, age: string, email: string }
 */
export function mergeObjects<
    T extends z.ZodRawShape,
    U extends z.ZodRawShape
>(
    schema1: z.ZodObject<T>,
    schema2: z.ZodObject<U>
): z.ZodObject<T & U> {
    return schema1.merge(schema2) as z.ZodObject<T & U>;
}

import { describe, it, expect } from "bun:test";
import z from "zod/v4";
import { mergeObjects } from "../src/mergeObjects";

describe("mergeObjects - Runtime Tests", () => {
    describe("basic functionality", () => {
        it("should merge two schemas with non-overlapping keys", () => {
            const schema1 = z.object({
                name: z.string(),
                age: z.number()
            });

            const schema2 = z.object({
                email: z.string(),
                phone: z.string()
            });

            const merged = mergeObjects(schema1, schema2);

            const result = merged.parse({
                name: "John",
                age: 30,
                email: "john@example.com",
                phone: "555-1234"
            });

            expect(result).toEqual({
                name: "John",
                age: 30,
                email: "john@example.com",
                phone: "555-1234"
            });
        });

        it("should override first schema properties with second schema properties", () => {
            const schema1 = z.object({
                name: z.string(),
                age: z.number()
            });

            const schema2 = z.object({
                age: z.string(), // Override: number -> string
                email: z.string()
            });

            const merged = mergeObjects(schema1, schema2);

            // Should accept string for age (from schema2)
            const result = merged.parse({
                name: "John",
                age: "30", // String now
                email: "john@example.com"
            });

            expect(result).toEqual({
                name: "John",
                age: "30",
                email: "john@example.com"
            });

            // Should reject number for age (overridden)
            expect(() => merged.parse({
                name: "John",
                age: 30, // Number is no longer valid
                email: "john@example.com"
            })).toThrow();
        });

        it("should require all properties from both schemas", () => {
            const schema1 = z.object({
                name: z.string(),
                age: z.number()
            });

            const schema2 = z.object({
                email: z.string()
            });

            const merged = mergeObjects(schema1, schema2);

            // Missing 'email' from schema2
            expect(() => merged.parse({
                name: "John",
                age: 30
            })).toThrow();

            // Missing 'name' from schema1
            expect(() => merged.parse({
                age: 30,
                email: "john@example.com"
            })).toThrow();
        });
    });

    describe("optional properties", () => {
        it("should handle optional properties correctly", () => {
            const schema1 = z.object({
                name: z.string(),
                age: z.number().optional()
            });

            const schema2 = z.object({
                email: z.string(),
                phone: z.string().optional()
            });

            const merged = mergeObjects(schema1, schema2);

            // All optional properties can be omitted
            const result1 = merged.parse({
                name: "John",
                email: "john@example.com"
            });

            expect(result1).toEqual({
                name: "John",
                email: "john@example.com"
            });

            // Optional properties can be included
            const result2 = merged.parse({
                name: "John",
                age: 30,
                email: "john@example.com",
                phone: "555-1234"
            });

            expect(result2).toEqual({
                name: "John",
                age: 30,
                email: "john@example.com",
                phone: "555-1234"
            });
        });

        it("should override optional with required", () => {
            const schema1 = z.object({
                name: z.string(),
                age: z.number().optional()
            });

            const schema2 = z.object({
                age: z.number() // Required now
            });

            const merged = mergeObjects(schema1, schema2);

            // age is now required
            expect(() => merged.parse({
                name: "John"
            })).toThrow();

            // Should work with age provided
            const result = merged.parse({
                name: "John",
                age: 30
            });

            expect(result).toEqual({
                name: "John",
                age: 30
            });
        });
    });

    describe("complex types", () => {
        it("should merge schemas with nested objects", () => {
            const schema1 = z.object({
                user: z.object({
                    name: z.string()
                })
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

            // Note: In Zod v4, merge replaces nested objects entirely (doesn't deep merge)
            // The second schema's user object replaces the first
            const result = merged.parse({
                user: {
                    email: "john@example.com"
                },
                metadata: {
                    createdAt: new Date()
                }
            });

            expect(result.user.email).toBe("john@example.com");
            expect(result.metadata.createdAt).toBeInstanceOf(Date);

            // user.name is not part of the merged schema (schema2's user replaced schema1's)
            expect(() => merged.parse({
                user: {
                    name: "John",
                    email: "john@example.com"
                },
                metadata: {
                    createdAt: new Date()
                }
            })).toThrow();
        });

        it("should merge schemas with arrays", () => {
            const schema1 = z.object({
                name: z.string(),
                tags: z.array(z.string())
            });

            const schema2 = z.object({
                email: z.string(),
                numbers: z.array(z.number())
            });

            const merged = mergeObjects(schema1, schema2);

            const result = merged.parse({
                name: "John",
                tags: ["developer", "typescript"],
                email: "john@example.com",
                numbers: [1, 2, 3]
            });

            expect(result).toEqual({
                name: "John",
                tags: ["developer", "typescript"],
                email: "john@example.com",
                numbers: [1, 2, 3]
            });
        });

        it("should merge schemas with unions and literals", () => {
            const schema1 = z.object({
                status: z.union([z.literal("active"), z.literal("inactive")])
            });

            const schema2 = z.object({
                role: z.enum(["admin", "user", "guest"])
            });

            const merged = mergeObjects(schema1, schema2);

            const result = merged.parse({
                status: "active",
                role: "admin"
            });

            expect(result).toEqual({
                status: "active",
                role: "admin"
            });

            expect(() => merged.parse({
                status: "pending", // Invalid literal
                role: "admin"
            })).toThrow();
        });
    });

    describe("empty schemas", () => {
        it("should handle merging with empty schema", () => {
            const schema1 = z.object({
                name: z.string(),
                age: z.number()
            });

            const schema2 = z.object({});

            const merged = mergeObjects(schema1, schema2);

            const result = merged.parse({
                name: "John",
                age: 30
            });

            expect(result).toEqual({
                name: "John",
                age: 30
            });
        });

        it("should handle merging two empty schemas", () => {
            const schema1 = z.object({});
            const schema2 = z.object({});

            const merged = mergeObjects(schema1, schema2);

            const result = merged.parse({});

            expect(result).toEqual({});
        });
    });

    describe("validation", () => {
        it("should validate all constraints from both schemas", () => {
            const schema1 = z.object({
                name: z.string().min(2),
                age: z.number().positive()
            });

            const schema2 = z.object({
                email: z.string().email(),
                age: z.number().max(100) // Override with different constraint
            });

            const merged = mergeObjects(schema1, schema2);

            // Valid data
            const result = merged.parse({
                name: "John",
                age: 50,
                email: "john@example.com"
            });

            expect(result.age).toBe(50);

            // Invalid age (from schema2's constraint)
            expect(() => merged.parse({
                name: "John",
                age: 150,
                email: "john@example.com"
            })).toThrow();

            // Invalid email
            expect(() => merged.parse({
                name: "John",
                age: 50,
                email: "invalid-email"
            })).toThrow();
        });
    });

    describe("default values", () => {
        it("should handle default values from both schemas", () => {
            const schema1 = z.object({
                name: z.string(),
                role: z.string().default("user")
            });

            const schema2 = z.object({
                email: z.string(),
                active: z.boolean().default(true)
            });

            const merged = mergeObjects(schema1, schema2);

            const result = merged.parse({
                name: "John",
                email: "john@example.com"
            });

            expect(result).toEqual({
                name: "John",
                role: "user",
                email: "john@example.com",
                active: true
            });
        });
    });
});

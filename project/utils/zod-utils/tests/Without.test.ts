import { describe, it, expect, test } from "bun:test";
import z from "zod/v4";
import { Without } from "../src/main";

describe("Without - Runtime Tests", () => {
    describe("basic functionality", () => {
        it("should remove a single key from schema", () => {
            const original = z.object({
                name: z.string(),
                age: z.number(),
                email: z.string()
            });

            const result = Without(original, ["age"]);

            // Should accept objects without the removed key
            expect(result.parse({ name: "John", email: "john@example.com" })).toEqual({
                name: "John",
                email: "john@example.com"
            });

            // Should reject if required keys are missing
            expect(() => result.parse({ name: "John" })).toThrow();
        });

        it("should remove multiple keys from schema", () => {
            const original = z.object({
                id: z.number(),
                name: z.string(),
                age: z.number(),
                email: z.string(),
                phone: z.string()
            });

            const result = Without(original, ["age", "phone"]);

            expect(result.parse({
                id: 1,
                name: "Jane",
                email: "jane@example.com"
            })).toEqual({
                id: 1,
                name: "Jane",
                email: "jane@example.com"
            });

            // Should reject if removed keys are present (they're not part of schema anymore)
            // Actually, Zod will ignore extra keys by default unless strict mode
            const parsed = result.parse({
                id: 1,
                name: "Jane",
                email: "jane@example.com",
                age: 30
            });
            expect(parsed).not.toHaveProperty("age");
        });

        it("should handle removing all but one key", () => {
            const original = z.object({
                a: z.string(),
                b: z.number(),
                c: z.boolean()
            });

            const result = Without(original, ["b", "c"]);

            expect(result.parse({ a: "test" })).toEqual({ a: "test" });
        });

        it("should preserve validation rules of remaining keys", () => {
            const original = z.object({
                email: z.string().email(),
                age: z.number().min(0).max(120),
                name: z.string().min(2)
            });

            const result = Without(original, ["age"]);

            // Valid data should pass
            expect(result.parse({
                email: "test@example.com",
                name: "John"
            })).toEqual({
                email: "test@example.com",
                name: "John"
            });

            // Invalid email should fail
            expect(() => result.parse({
                email: "invalid-email",
                name: "John"
            })).toThrow();

            // Short name should fail
            expect(() => result.parse({
                email: "test@example.com",
                name: "J"
            })).toThrow();
        });
    });

    describe("edge cases", () => {
        it("should handle removing no keys (empty array)", () => {
            const original = z.object({
                name: z.string(),
                age: z.number()
            });

            const result = Without(original, []);

            expect(result.parse({ name: "John", age: 30 })).toEqual({
                name: "John",
                age: 30
            });
        });

        it("should work with optional fields", () => {
            const original = z.object({
                required: z.string(),
                optional: z.string().optional(),
                toRemove: z.number()
            });

            const result = Without(original, ["toRemove"]);

            expect(result.parse({ required: "test" })).toEqual({ required: "test" });
            expect(result.parse({ required: "test", optional: "value" })).toEqual({
                required: "test",
                optional: "value"
            });
        });

        it("should work with default values", () => {
            const original = z.object({
                name: z.string(),
                count: z.number().default(0),
                toRemove: z.boolean()
            });

            const result = Without(original, ["toRemove"]);

            const parsed = result.parse({ name: "test" });
            expect(parsed).toEqual({ name: "test", count: 0 });
        });

        it("should work with nested objects", () => {
            const original = z.object({
                id: z.number(),
                user: z.object({
                    name: z.string(),
                    email: z.string()
                }),
                metadata: z.record(z.string())
            });

            const result = Without(original, ["metadata"]);

            expect(result.parse({
                id: 1,
                user: { name: "John", email: "john@example.com" }
            })).toEqual({
                id: 1,
                user: { name: "John", email: "john@example.com" }
            });
        });

        it("should work with arrays", () => {
            const original = z.object({
                items: z.array(z.string()),
                count: z.number(),
                tags: z.array(z.string())
            });

            const result = Without(original, ["tags"]);

            expect(result.parse({
                items: ["a", "b", "c"],
                count: 3
            })).toEqual({
                items: ["a", "b", "c"],
                count: 3
            });
        });
    });

    describe("complex scenarios", () => {
        it("should work with union types", () => {
            const original = z.object({
                type: z.union([z.literal("user"), z.literal("admin")]),
                name: z.string(),
                password: z.string()
            });

            const result = Without(original, ["password"]);

            expect(result.parse({ type: "user", name: "John" })).toEqual({
                type: "user",
                name: "John"
            });
        });

        it("should work with refined schemas", () => {
            const original = z.object({
                password: z.string().min(8),
                confirmPassword: z.string(),
                email: z.string().email()
            });

            const result = Without(original, ["confirmPassword"]);

            expect(result.parse({
                password: "securepass123",
                email: "test@example.com"
            })).toEqual({
                password: "securepass123",
                email: "test@example.com"
            });
        });

        it("should handle chained operations", () => {
            const original = z.object({
                a: z.string(),
                b: z.number(),
                c: z.boolean(),
                d: z.string()
            });

            const step1 = Without(original, ["b"]);
            const step2 = Without(step1, ["d"]);

            expect(step2.parse({ a: "test", c: true })).toEqual({
                a: "test",
                c: true
            });
        });
    });
});

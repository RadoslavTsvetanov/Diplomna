import type { URecord } from "@blazyts/better-standard-library";

export type RecordToUnion<T extends Record<string, URecord>> = {
    [K in keyof T]: { version: K; value: T[K] }
}[keyof T];

type User = { h: string }
type Order = { ko: number }
// Usage examples:
type Example2 = RecordToUnion<{ a: User; b: Order }>;
// { key: "a"; value: User } | { key: "b"; value: Order }
type Example3 = RecordToUnion<{ 1: { id: string } }>;
// { key: "1"; value: { id: string } }
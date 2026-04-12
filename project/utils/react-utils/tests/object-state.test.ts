import type { SetStateAction } from "react";

import { describe, expect, expectTypeOf, it, vi } from "vitest";

import type { ObjectState } from "../src";
import { useObjectState } from "../src";

const useStateMock = vi.hoisted(() => vi.fn());

vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();

  return {
    ...actual,
    useState: useStateMock,
  };
});

describe("useObjectState", () => {
  it("returns state and setter in an object", () => {
    const set = vi.fn();
    useStateMock.mockReturnValueOnce(["ready", set]);

    const result = useObjectState("idle");

    expect(useStateMock).toHaveBeenCalledWith("idle");
    expect(result).toEqual({
      set,
      state: "ready",
    });
  });

  it("accepts lazy initial state", () => {
    const initialState = () => ({ count: 1 });
    const set = vi.fn();
    useStateMock.mockReturnValueOnce([{ count: 1 }, set]);

    const result = useObjectState(initialState);

    expect(useStateMock).toHaveBeenCalledWith(initialState);
    expect(result.state).toEqual({ count: 1 });
    expect(result.set).toBe(set);
  });

  it("types the setter like React useState", () => {
    const set = vi.fn();
    useStateMock.mockReturnValueOnce([0, set]);

    const result = useObjectState(0);
    const increment: SetStateAction<number> = current => current + 1;

    result.set(increment);

    expect(set).toHaveBeenCalledWith(increment);
    expectTypeOf(result).toEqualTypeOf<ObjectState<number>>();
  });
});

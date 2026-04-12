import { useState } from "react";
import type { SetStateAction } from "react";

export type ObjectState<T> = {
  set: (value: SetStateAction<T>) => void;
  state: T;
};

export function useObjectState<T>(initialState: T | (() => T)): ObjectState<T> {
  const [state, set] = useState<T>(initialState);

  return {
    set,
    state,
  };
}

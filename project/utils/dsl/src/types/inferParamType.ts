import type { Optionable } from "@blazyts/better-standard-library";
import type { Alphabet, ContainsAtTheEnd, ContainsAtTheStart, RemoveNonAlphabetic } from "./utils";

type InferParamType<Param extends string> =
  ContainsAtTheEnd<Param, "$"> extends true
    ? number
    : ContainsAtTheEnd<Param, "("> extends true
      ? Date
      : ContainsAtTheEnd<Param, "^"> extends true
        ? boolean
        : string;






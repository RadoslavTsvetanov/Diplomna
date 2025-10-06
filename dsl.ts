
export type Alphabet =
  | "a" | "b" | "c" | "d" | "e" | "f" | "g"
  | "h" | "i" | "j" | "k" | "l" | "m" | "n"
  | "o" | "p" | "q" | "r" | "s" | "t" | "u"
  | "v" | "w" | "x" | "y" | "z"
  | "A" | "B" | "C" | "D" | "E" | "F" | "G"
  | "H" | "I" | "J" | "K" | "L" | "M" | "N"
  | "O" | "P" | "Q" | "R" | "S" | "T" | "U"
  | "V" | "W" | "X" | "Y" | "Z";


export type ContainsAtTheEnd<T extends string, Y extends string> = T extends `${infer Rest}${Y}` ? true : false;
export type ContainsAtTheStart<T extends string, Y extends string> = T extends `${Y}${infer Rest}` ? true : false



export type RemoveNonAlphabetic<S extends string> =
  S extends `${infer First}${infer Rest}`
  ? First extends Alphabet
  ? `${First}${RemoveNonAlphabetic<Rest>}`
  : RemoveNonAlphabetic<Rest>
  : "";


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





export type ExtractParams<
  T extends string,
  ReturnType extends Record<string, string> = {}
> = T extends `/${infer CurrentParam}`
  ? CurrentParam extends `:${infer ParamName}`
    ? ParamName extends `${infer Param}/${infer Rest}`
      ? ExtractParams<
        `/${Rest}`,
        {
          [P in Param as RemoveNonAlphabetic<P>]: ContainsAtTheStart<Param, "?"> extends true ? Optionable<InferParamType<Param>> :   InferParamType<Param>
        }
     &
        {
          [P in keyof ReturnType]: ReturnType[P]
        }
      >
    : { [P in keyof ReturnType]: ReturnType[P] } & { [p in ParamName]: string }
      : CurrentParam extends `${infer NotDynamicParam}/${infer Rest}`
        ? ExtractParams<`/${Rest}`, ReturnType>
        : ReturnType
  : never


export function extractParams<T extends string>(path: T): ExtractParams<T> {
  return {} as ExtractParams<T>;
}

import { Optionable, PretifyRecord } from "@blazyts/better-standard-library";
import { InferParamType } from "./inferParamType";
import { ContainsAtTheStart, RemoveNonAlphabetic } from "./utils";

export type isRecord<T> = T extends Record<string, unknown> ? true : false;

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
        : PretifyRecord<ReturnType>      
  : never


export function extractParams<T extends string>(path: T): PretifyRecord<ExtractParams<T>> {
  return {} as ExtractParams<T>;
}
import { ZodObject, z, type ZodRawShape, type infer as zInfer } from "zod/v3"

export class EnvManager<T extends ZodRawShape> {
  private readonly schema: ZodObject<T>

  private constructor(schema: ZodObject<T>) {
    this.schema = schema
  }

  static new<T extends ZodRawShape>(shape: T): EnvManager<T> {
    return new EnvManager(z.object(shape))
  }

  /**
   * Parses and validates process.env against the schema.
   * Throws a ZodError if validation fails.
   */
  get envs(): zInfer<ZodObject<T>> {
    const parsed = this.schema.parse(process.env)
    return parsed
  }
}

import type { TopicSchema, TopicSchemaDefault } from "./TopicSchema"

export type SchemaTree = {
    [branch: string]: SchemaTree | TopicSchemaDefault
}
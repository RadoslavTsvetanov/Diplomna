import type { TopicClient } from "./TopicClient";
import { SchemaTree, TopicSchema, TopicSchemaDefault } from "./types";

type CreateClient<T extends SchemaTree> = {

    [K in keyof T]: T[K] extends { type: "topic-schema" }
    ? TopicClient<T[K]["TGetVersions"]>    // ugly but gets the job done 
    : CreateClient<T[K]>
}


export class RegistryManager<TSChemaTree extends SchemaTree> {
    constructor(public readonly schema: TSChemaTree) { }


    addTopic<TTopicSchema extends TopicSchema<TopicSchemaDefault>>(v: TTopicSchema) {

    }

    createClient(): CreateClient<TSChemaTree>
}

new RegistryManager({
    "users": {
        "created": {
            "fromGoogle": new TopicSchema({ v1: { userId: "" }, v2: { userId: 3 } }),
            "fromNormalSignup": { v1: { userId: "" } }

        }
    }
}).createClient().users.created.fromGoogle
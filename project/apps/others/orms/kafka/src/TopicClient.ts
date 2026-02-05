import type { HasOnlyOneKey, RecordToUnion, TopicSchema, TopicSchemaDefault } from "./types";

export class TopicClient<TTopicSchema extends TopicSchemaDefault> {
    constructor(public readonly topicSchema: TTopicSchema) {

    }

    consumeAll(callBack: (v: RecordToUnion<TTopicSchema>) => void) { }

    consume(config: HasOnlyOneKey<TTopicSchema> extends true ? (v: TTopicSchema[keyof TTopicSchema]) => void : { [K in keyof TTopicSchema]: (v: TTopicSchema[K]) => void }) {

    }
}

new TopicClient({ v1: { user: "" } })
    .consume(v => v.user)

const tCleint1 = new TopicClient({ v1: { userID: "" }, v2: { userId: 1 } })
tCleint1.consume({ v1: v => v.userID, v2: v => v.userId })
tCleint1.consumeAll(v => {

    if (v.version === "v1") {
        v.value
    }
}
)
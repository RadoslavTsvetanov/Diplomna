import type { HasOnlyOneKey, RecordToUnion, TopicSchema, TopicSchemaDefault } from "./types";



export class TopicClient<TTopicSchema extends TopicSchemaDefault> {

    constructor(public readonly topicSchema: TTopicSchema) {

    }

    consumeAll(callBack: (v: RecordToUnion<TTopicSchema>) => void) { }

    consume(config: HasOnlyOneKey<TTopicSchema> extends true ? (v: TTopicSchema[keyof TTopicSchema]) => void : { [K in keyof TTopicSchema]: (v: TTopicSchema[K]) => void }) {

    }

    produce: HasOnlyOneKey<TTopicSchema> extends true
        ? (v: TTopicSchema[keyof TTopicSchema]) => void
        : { [K in keyof TTopicSchema]: (v: TTopicSchema[K]) => void } = {
            
        }

}

const topicCleint2 = new TopicClient({ v1: { user: "" } })

topicCleint2.consume(v => v.user)
topicCleint2.produce({user: ""})

const tCleint1 = new TopicClient({ v1: { userID: "" }, v2: { userId: 1 } })
tCleint1.consume({ v1: v => v.userID, v2: v => v.userId })
tCleint1.consumeAll(v => {
        if (v.version === "v1") {
            v.value
        }
    }
)

tCleint1.produce.v1({userID: ""})
tCleint1.produce.v2({userId: 3})
import { createTypeSafeKafkaClient } from "./src/TopicClient";
import type { TopicSchema } from "./src/types";

// Define your message types
interface UserSignedUpEvent {
    userId: string;
    email: string;
    createdAt: string;
}

interface OrderCreatedEvent {
    orderId: string;
    userId: string;
    total: number;
    items: Array<{ productId: string; quantity: number }>;
}

// Define topic schemas
const userSignedUpSchema: TopicSchema<UserSignedUpEvent> = {
    topicName: 'user.signed-up',
    schema: {} as UserSignedUpEvent,
    version: 1,
};

const orderCreatedSchema: TopicSchema<OrderCreatedEvent> = {
    topicName: 'order.created',
    schema: {} as OrderCreatedEvent,
    version: 1,
};

/**
 * Example: Producer - Publish type-safe messages
 */
async function producerExample() {
    const { createSchemaManager, createProducer } = createTypeSafeKafkaClient({
        brokers: ['localhost:9092'],
        clientId: 'producer-app',
    });

    // Create schema manager and register schemas
    const schemaManager = createSchemaManager([
        userSignedUpSchema,
        orderCreatedSchema,
    ]);

    // Create producer
    const producer = createProducer(schemaManager);

    try {
        await producer.connect();

        // Publish user signed up event - fully type-safe!
        await producer.publishMessage('user.signed-up', {
            key: 'user-123',
            value: {
                userId: 'user-123',
                email: 'john@example.com',
                createdAt: new Date().toISOString(),
            },
        });

        // Publish order created event - fully type-safe!
        await producer.publishMessage('order.created', {
            key: 'order-456',
            value: {
                orderId: 'order-456',
                userId: 'user-123',
                total: 99.99,
                items: [
                    { productId: 'prod-1', quantity: 2 },
                    { productId: 'prod-2', quantity: 1 },
                ],
            },
        });

        console.log('✅ Messages published successfully');
    } catch (error) {
        console.error('❌ Producer error:', error);
    } finally {
        await producer.disconnect();
    }
}

/**
 * Example: Consumer - Consume type-safe messages
 */
async function consumerExample() {
    const { createSchemaManager, createConsumer } = createTypeSafeKafkaClient({
        brokers: ['localhost:9092'],
        clientId: 'consumer-app',
    });

    // Create schema manager
    const schemaManager = createSchemaManager([
        userSignedUpSchema,
        orderCreatedSchema,
    ]);

    // Create consumer
    const consumer = createConsumer('my-consumer-group', schemaManager);

    try {
        await consumer.connect();

        // Subscribe to user signed up events with full type safety
        await consumer.run('user.signed-up', async (message) => {
            // message.value has the correct type: UserSignedUpEvent
            console.log(
                `📨 User signed up: ${message.value.email} (ID: ${message.value.userId})`
            );
            console.log(`   Partition: ${message.partition}, Offset: ${message.offset}`);
        });

        // Run consumer until interrupted
        console.log('🚀 Consumer listening...');
    } catch (error) {
        console.error('❌ Consumer error:', error);
    } finally {
        await consumer.disconnect();
    }
}

/**
 * Example: Multi-topic consumer
 */
async function multiTopicConsumerExample() {
    const { createSchemaManager, createConsumer } = createTypeSafeKafkaClient({
        brokers: ['localhost:9092'],
        clientId: 'multi-consumer',
    });

    const schemaManager = createSchemaManager([
        userSignedUpSchema,
        orderCreatedSchema,
    ]);

    const consumer = createConsumer('multi-consumer-group', schemaManager);

    try {
        await consumer.connect();

        // Subscribe to multiple topics
        await consumer.subscribeToMultiple(['user.signed-up', 'order.created'], {
            fromBeginning: true,
        });

        // Handle all messages with type safety
        await consumer.runMultiple(async (message) => {
            if (message.topic === 'user.signed-up') {
                // TypeScript knows this is UserSignedUpEvent
                const typedMsg = message as Extract<typeof message, { topic: 'user.signed-up' }>;
                console.log(`👤 ${typedMsg.value.email}`);
            } else if (message.topic === 'order.created') {
                // TypeScript knows this is OrderCreatedEvent
                const typedMsg = message as Extract<typeof message, { topic: 'order.created' }>;
                console.log(`📦 Order ${typedMsg.value.orderId}: $${typedMsg.value.total}`);
            }
        });
    } catch (error) {
        console.error('❌ Multi-topic consumer error:', error);
    } finally {
        await consumer.disconnect();
    }
}

// Run examples based on process arguments
const example = process.argv[2];

switch (example) {
    case 'producer':
        await producerExample();
        break;
    case 'consumer':
        await consumerExample();
        break;
    case 'multi':
        await multiTopicConsumerExample();
        break;
    default:
        console.log(`Usage: bun run examples.ts [producer|consumer|multi]`);
}

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Kafka, Producer, Consumer } from 'kafkajs';
import { RegistryManager } from '../../src/ConfluentManager';
import { TopicSchema } from '../../src/types';

describe('Kafka Schema Validation Tests', () => {
    let kafka: Kafka;
    let producer: Producer;
    let consumer: Consumer;
    const brokers = ['localhost:9092'];
    const testTopic = 'test-validation-topic';

    beforeAll(async () => {
        kafka = new Kafka({
            clientId: 'test-client',
            brokers,
        });

        producer = kafka.producer();
        consumer = kafka.consumer({ groupId: 'test-group' });

        await producer.connect();
        await consumer.connect();
        await consumer.subscribe({ topic: testTopic, fromBeginning: true });
    });

    afterAll(async () => {
        await producer.disconnect();
        await consumer.disconnect();
    });

    it('should fail type checking when sending invalid message with typed manager', async () => {
        // Type-safe manager would catch this at compile time
        // This demonstrates the type error scenario
        
        const manager = new RegistryManager({users: {created: new TopicSchema({v2: {userId: ""}})}});
        
       manager.createClient().users.created.produce({userId : 1})
        

        expect(result).toBeDefined();
    });

    it('should send invalid message with regular client without type safety', async () => {
        const receivedMessages: any[] = [];
        
        consumer.run({
            eachMessage: async ({ message }) => {
                receivedMessages.push(JSON.parse(message.value!.toString()));
            },
        });

        const invalidMessage = { id: '456', name: 'Test', age: 'not-a-number' };
        
        const result = await producer.send({
            topic: testTopic,
            messages: [{ value: JSON.stringify(invalidMessage) }],
        });

        expect(result.length).toBeGreaterThan(0);
        expect(result[0].errorCode).toBe(0);

        // Wait for message to be consumed
        await new Promise(resolve => setTimeout(resolve, 2000));

        expect(receivedMessages.length).toBeGreaterThan(0);
        expect(receivedMessages[0]).toEqual(invalidMessage);
        expect(typeof receivedMessages[0].age).toBe('string');
    });
});
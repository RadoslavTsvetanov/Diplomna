// Export all types and utilities
export * from './src/types.js';
export * from './src/TopicClient.js';

// Re-export Kafka types for convenience
export type { Producer, Consumer, Kafka } from 'kafkajs';

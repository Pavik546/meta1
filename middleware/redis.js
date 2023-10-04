const redis = require('redis');
const { promisify } = require('util');

const client = redis.createClient();

// Promisify Redis functions for async/await
const redisGetAsync = promisify(client.get).bind(client);
const redisSetAsync = promisify(client.set).bind(client);
const redisDelAsync = promisify(client.del).bind(client);

// Handle Redis client errors (optional)
client.on('error', (error) => {
    console.error('Redis client error:', error);
});

module.exports = {
    client,
    redisGetAsync,
    redisSetAsync,
    redisDelAsync
};

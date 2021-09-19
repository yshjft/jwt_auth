const redis = require('redis');
const client = redis.createClient(6379, "127.0.0.1");

client.on("error", (err) => {
    console.error(err);
});
client.on("ready", () => {
    console.log("Redis is ready");
});

module.exports = client

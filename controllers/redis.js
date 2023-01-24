const redis = require("redis");
const redisClient = redis.createClient();

redisClient
  .connect()
  .then(async (res) => {
    console.log('connected');
  })
  .catch((err) => {
    console.log('err happened' + err);
  });

module.exports = {
    redisClient
}
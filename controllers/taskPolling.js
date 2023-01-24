const { client } = require('./redis')

const pollScheduler = async () => {
  try {
    await client.watch('scheduler')

    let data = await client.zrangebyscore(["scheduler", Math.floor(+new Date() / 1000), 0, "WITHSCORES", "LIMIT", 0, 1])
    data = data[0]

    if (data) {
      const parsedData = JSON.parse(data)
      const updated = await client
        .multi()
        .zrem('scheduler', data)
        .rpush(parsedData.taskType, JSON.stringify(parsedData.details))
        .exec()

      if (updated) { // success
        pollScheduler()
      } else { // error try again
        pollScheduler()
      }
    } else { // no data poll again after delay
      await client.unwatch()
      setTimeout(() => { pollScheduler() }, 1000)
    }
  } catch (error) {
    console.log({ error })
  }
}

pollScheduler()
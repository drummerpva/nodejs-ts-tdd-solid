import env from './config/env'
import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper'

/* MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    const app = (await import('./config/app')).default
    app.listen(env.port, () =>
      console.log(`Server running att http://localhost:${env.port}`)
    )
  })
  .catch(console.error) */
async function init(): Promise<void> {
  await MongoHelper.connect(env.mongoUrl)
  const app = (await import('./config/app')).default
  app.listen(env.port, () =>
    console.log(`Server running att http://localhost:${env.port}`)
  )
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
init()

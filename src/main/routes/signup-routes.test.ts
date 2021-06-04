import request from 'supertest'
import faker from 'faker'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

describe('SignUp Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    const accountCollections = MongoHelper.getCollection('accounts')
    await accountCollections.deleteMany({})
  })
  test('Should return 200 and an account on success', async () => {
    const fakeEndpoint = '/api/signup'
    const passwordFake = faker.internet.password()
    const accountDataFake = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: passwordFake,
      passwordConfirmation: passwordFake
    }
    await request(app).post(fakeEndpoint).send(accountDataFake).expect(200)
  })
})

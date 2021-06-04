import request from 'supertest'
import faker from 'faker'
import app from '../config/app'

describe('SignUp Routes', () => {
  test('Should return 200 and an account on success', async () => {
    const fakeEndpoint = '/api/signup'
    const passwordFake = faker.internet.password()
    const accountDataFake = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: passwordFake,
      passowrdConfirmation: passwordFake
    }
    await request(app).post(fakeEndpoint).send(accountDataFake).expect(200)
  })
})

import { Request, Response } from 'express'
import faker from 'faker'
import request from 'supertest'
import app from '../config/app'

describe('Body Parser Middleware', () => {
  test('', async () => {
    const fakeEndpoint = '/test_body_parser'
    app.post(fakeEndpoint, (req: Request, res: Response) => {
      res.send(req.body)
    })
    const dataFake = {
      name: faker.name.findName()
    }
    await request(app).post(fakeEndpoint).send(dataFake).expect(dataFake)
  })
})

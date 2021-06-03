import { Request, Response } from 'express'
import request from 'supertest'
import app from '../config/app'

describe('CORS Middleware', () => {
  test('Should enable cors', async () => {
    const fakeEndpoint = '/test_cors'
    app.get(fakeEndpoint, (req: Request, res: Response) => {
      res.send()
    })
    await request(app)
      .get(fakeEndpoint)
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-headers', '*')
  })
})

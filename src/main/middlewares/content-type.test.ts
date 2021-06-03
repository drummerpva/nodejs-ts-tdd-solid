import { Request, Response } from 'express'
import request from 'supertest'
import app from '../config/app'

describe('Content Type Middleware', () => {
  test('Should return default content type as json', async () => {
    const fakeEndpoint = '/test_content_type_json'
    app.get(fakeEndpoint, (req: Request, res: Response) => {
      res.send('')
    })
    await request(app).get(fakeEndpoint).expect('content-type', /json/i)
  })
  test('Should return xml content type when forced', async () => {
    const fakeEndpoint = '/test_content_type_xml'
    app.get(fakeEndpoint, (req: Request, res: Response) => {
      res.type('xml')
      res.send('')
    })
    await request(app).get(fakeEndpoint).expect('content-type', /xml/i)
  })
})

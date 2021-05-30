import { InvalidParamError } from '../errors/invalid-param-error'
import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/http-helper'
import { Controller } from '../protocols/controller'
import { EmailValidator } from '../protocols/email-validator'
import { HttpRequest, HttpResponse } from '../protocols/http'

export class SignUpController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) {}
  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
    const { email, password, passwordConfirmation } = httpRequest.body
    const isEmailValid = this.emailValidator.isValid(email)
    if (!isEmailValid) {
      return badRequest(new InvalidParamError('email'))
    }
    if (password !== passwordConfirmation) {
      return badRequest(new InvalidParamError('passwordConfirmation'))
    }
    return {
      statusCode: 200,
      body: {}
    }
  }
}

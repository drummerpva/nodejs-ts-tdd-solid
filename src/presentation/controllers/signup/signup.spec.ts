import { SignUpController } from './signup'
import faker from 'faker'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import {
  EmailValidator,
  AddAccount,
  AddAccountModel,
  AccountModel
} from './signup-protocols'

type SutType = {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}
const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}
const makeFakeAccount: AccountModel = {
  id: faker.datatype.uuid(),
  name: faker.name.findName(),
  email: faker.internet.email()
}
const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      return await Promise.resolve(makeFakeAccount)
    }
  }
  return new AddAccountStub()
}
const makeSut = (): SutType => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)
  return { sut, emailValidatorStub, addAccountStub }
}

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', async () => {
    const { sut } = makeSut()
    const passFake = faker.internet.password()
    const httpRequest = {
      body: {
        email: faker.internet.email(),
        password: passFake,
        passwordConfirmation: passFake
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse?.statusCode).toBe(400)
    expect(httpResponse?.body).toEqual(new MissingParamError('name').message)
  })
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const passFake = faker.internet.password()
    const httpRequest = {
      body: {
        name: faker.name.findName(),
        password: passFake,
        passwordConfirmation: passFake
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse?.statusCode).toBe(400)
    expect(httpResponse?.body).toEqual(new MissingParamError('email').message)
  })
  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: faker.name.findName(),
        email: faker.internet.email(),
        passwordConfirmation: faker.internet.password()
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse?.statusCode).toBe(400)
    expect(httpResponse?.body).toEqual(
      new MissingParamError('password').message
    )
  })
  test('Should return 400 if no passwordConfirmation is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password()
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse?.statusCode).toBe(400)
    expect(httpResponse?.body).toEqual(
      new MissingParamError('passwordConfirmation').message
    )
  })
  test('Should return 400 if password not equal passwordConfirmation', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.random.alphaNumeric(8),
        passwordConfirmation: faker.random.alphaNumeric(9)
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse?.statusCode).toBe(400)
    expect(httpResponse?.body).toEqual(
      new InvalidParamError('passwordConfirmation').message
    )
  })
  test('Should return 400 if invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const passFake = faker.internet.password()
    const httpRequest = {
      body: {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: passFake,
        passwordConfirmation: passFake
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse?.statusCode).toBe(400)
    expect(httpResponse?.body).toEqual(new InvalidParamError('email').message)
  })
  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const passFake = faker.internet.password()
    const mailFake = faker.internet.email()
    const httpRequest = {
      body: {
        name: faker.name.findName(),
        email: mailFake,
        password: passFake,
        passwordConfirmation: passFake
      }
    }
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith(mailFake)
  })
  test('Should return 500 if EmailValidor throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const passFake = faker.internet.password()
    const httpRequest = {
      body: {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: passFake,
        passwordConfirmation: passFake
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse?.statusCode).toBe(500)
    expect(httpResponse?.body).toEqual(new ServerError())
  })
  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const passFake = faker.internet.password()
    const mailFake = faker.internet.email()
    const nameFake = faker.name.findName()
    const httpRequest = {
      body: {
        name: nameFake,
        email: mailFake,
        password: passFake,
        passwordConfirmation: passFake
      }
    }
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: nameFake,
      email: mailFake,
      password: passFake
    })
  })
  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return await Promise.reject(new Error())
    })
    const passFake = faker.internet.password()
    const httpRequest = {
      body: {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: passFake,
        passwordConfirmation: passFake
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse?.statusCode).toBe(500)
    expect(httpResponse?.body).toEqual(new ServerError())
  })
  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const passFake = faker.internet.password()
    const nameFake = faker.name.findName()
    const emailFake = faker.internet.email()
    const httpRequest = {
      body: {
        name: nameFake,
        email: emailFake,
        password: passFake,
        passwordConfirmation: passFake
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse?.statusCode).toBe(200)
    expect(httpResponse?.body).toEqual(makeFakeAccount)
  })
})

import { AccountModel } from '../../domain/models/account'
import { AddAccountModel } from '../../domain/usecases/add-account'
import { Encrypter } from '../protocols/encrypter'

export class DbAddAccount {
  constructor(private readonly encrypter: Encrypter) {}

  async add(account: AddAccountModel): Promise<AccountModel | null> {
    const { password } = account
    await this.encrypter.encrypt(password)
    return await Promise.resolve(null)
  }
}

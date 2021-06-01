import {
  AccountModel,
  AddAccountModel,
  Encrypter
} from './db-add-account-protocols'

export class DbAddAccount {
  constructor(private readonly encrypter: Encrypter) {}

  async add(account: AddAccountModel): Promise<AccountModel | null> {
    const { password } = account
    await this.encrypter.encrypt(password)
    return await Promise.resolve(null)
  }
}

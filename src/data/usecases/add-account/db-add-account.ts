import {
  AccountModel,
  AddAccountModel,
  Encrypter,
  AddAccountRepository
} from './db-add-account-protocols'

export class DbAddAccount {
  constructor(
    private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add(account: AddAccountModel): Promise<AccountModel | null> {
    const { password } = account
    const hashedPassword = await this.encrypter.encrypt(password)
    await this.addAccountRepository.add(
      Object.assign({}, account, { password: hashedPassword })
    )
    return await Promise.resolve(null)
  }
}

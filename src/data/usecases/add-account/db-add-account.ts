import {
  AccountModel,
  AddAccountModel,
  Encrypter,
  AddAccountRepository,
  AddAccount
} from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add(addAccount: AddAccountModel): Promise<AccountModel> {
    const { password } = addAccount
    const hashedPassword = await this.encrypter.encrypt(password)
    const account = await this.addAccountRepository.add(
      Object.assign({}, addAccount, { password: hashedPassword })
    )
    return account
  }
}

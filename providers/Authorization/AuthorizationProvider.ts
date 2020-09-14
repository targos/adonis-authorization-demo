import { IocContract } from '@adonisjs/fold'

import { HttpContextConstructorContract } from '@ioc:Adonis/Core/HttpContext'

import Gate from './Gate'

export default class AuthorizationProvider {
  constructor (protected container: IocContract) {}

  public register () {
    this.container.singleton('Adonis/Addons/Authorization', () => {
      return { Gate: new Gate() }
    })
  }

  public boot () {
    this.container.with(
      ['Adonis/Core/HttpContext', 'Adonis/Addons/Authorization'],
      (HttpContext: HttpContextConstructorContract, { Gate }: any) => {
        HttpContext.getter(
          'gate',
          function gateGetter () {
            // TODO: handle when there is no authenticated user.
            return Gate.forUser(this.auth.user)
          },
          true,
        )
      },
    )
  }
}

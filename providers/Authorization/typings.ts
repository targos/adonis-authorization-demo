declare module '@ioc:Adonis/Addons/Authorization' {
  // TODO: expose user type from @ioc:Adonis/Addons/Auth ?
  import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
  export type User = Exclude<HttpContextContract['auth']['user'], undefined>

  export interface GlobalActions {}

  class Gate {
    public define<Action extends keyof GlobalActions>(
      action: Action,
      gate: (user: User, ...args: GlobalActions[Action]) => boolean,
    ): void;

    public forUser (user: User): UserGateContract;
  }

  type RemoveFirstFromTuple<T extends any[]> = ((...b: T) => void) extends (
    a,
    ...b: infer I
  ) => void
    ? I
    : []

  export interface UserGateContract {
    allows<Action extends keyof GlobalActions>(
      action: Action,
      ...args: GlobalActions[Action]
    ): Promise<boolean>;
    allows<
      PolicyConstructor extends new () => any,
      PolicyMethod extends keyof InstanceType<PolicyConstructor>
    >(
      policy: PolicyConstructor,
      method: PolicyMethod,
      ...args: RemoveFirstFromTuple<
        Parameters<InstanceType<PolicyConstructor>[PolicyMethod]>
      >
    ): Promise<boolean>;

    denies<Action extends keyof GlobalActions>(
      action: Action,
      ...args: GlobalActions[Action]
    ): Promise<boolean>;

    authorize<Action extends keyof GlobalActions>(
      action: Action,
      ...args: GlobalActions[Action]
    ): Promise<void>;

    // TODO: any, none, all?
  }

  const gate: Gate

  export { gate as Gate }
}

declare module '@ioc:Adonis/Core/HttpContext' {
  import { UserGateContract } from '@ioc:Adonis/Addons/Authorization'

  interface HttpContextContract {
    gate: UserGateContract;
  }
}

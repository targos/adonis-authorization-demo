declare module '@ioc:Adonis/Addons/Authorization' {
  // TODO: expose user type from @ioc:Adonis/Addons/Auth ?
  import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
  export type User = Exclude<HttpContextContract['auth']['user'], undefined>
  export type UserOrGuest = User | undefined

  export interface GlobalActions {}

  class Gate {
    public define<Action extends keyof GlobalActions>(
      action: Action,
      gate: (user: User, ...args: GlobalActions[Action]) => boolean,
    ): void;

    public registerPolicies (policies: any): void;

    public forUser (user?: User): UserGateContractWithoutResource;
  }

  type RemoveFirstFromTuple<T extends any[]> = ((...b: T) => void) extends (
    a,
    ...b: infer I
  ) => void
    ? I
    : []

  export interface UserGateContractWithoutResource {
    allows<Action extends keyof GlobalActions>(
      action: Action,
      ...args: GlobalActions[Action]
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

    // TODO: infer T from the type of resource
    for<T extends new () => any>(resource: unknown): UserGateContractWithResource<T>;
  }

  // TODO: enable additional arguments
  // This is not trivial and we cannot just remove the first or two elements from tuple
  // because there are gates that have one element to remove (the user, for gates that do not expect an instance)
  // and other gates that have two (the user and the instance)
  export interface UserGateContractWithResource<PolicyConstructor extends new () => any> {
    allows<PolicyMethod extends keyof InstanceType<PolicyConstructor>>(
      action: PolicyMethod,
      // ...args: RemoveFirstFromTuple<Parameters<InstanceType<PolicyConstructor>[PolicyMethod]>>
    ): Promise<boolean>;

    denies<PolicyMethod extends keyof InstanceType<PolicyConstructor>>(
      action: PolicyMethod,
    //   ...args: RemoveFirstFromTuple<
    //   Parameters<InstanceType<PolicyConstructor>[PolicyMethod]>
    // >
    ): Promise<boolean>;

    authorize<PolicyMethod extends keyof InstanceType<PolicyConstructor>>(
      action: PolicyMethod,
    //   ...args: RemoveFirstFromTuple<
    //   Parameters<InstanceType<PolicyConstructor>[PolicyMethod]>
    // >
    ): Promise<void>;

    // TODO: any, none, all?
  }

  type TypedDecorator<PropType> = <
    TKey extends string,
    TTarget extends { [K in TKey]: (user: PropType, ...otherArgs: unknown[]) => boolean | Promise<boolean> }
  >(
    target: TTarget,
    property: TKey
  ) => void

  export function gate (options?: {}): TypedDecorator<User>
  export function gate (options: { allowGuest: true }): TypedDecorator<UserOrGuest>

  const gate: Gate
  export { gate as Gate }
}

declare module '@ioc:Adonis/Core/HttpContext' {
  import { UserGateContractWithoutResource } from '@ioc:Adonis/Addons/Authorization'

  interface HttpContextContract {
    gate: UserGateContractWithoutResource;
  }
}

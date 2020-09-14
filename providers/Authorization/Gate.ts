type PolicyType = any
type PolicyClassType = new () => unknown
type GateCallback = (...args: unknown[]) => unknown

export default class Gate {
  private actions = new Map<string, GateCallback>()
  private policies = new Map<PolicyClassType, PolicyType>()

  public define (action: string, callback: GateCallback) {
    this.actions.set(action, callback)
  }

  public forUser (user: unknown): UserGate {
    return new UserGate(user, this)
  }

  public async allows (
    user: unknown,
    action: string,
    ...params: unknown[]
  ): Promise<boolean>;
  public async allows (
    user: unknown,
    policyClass: PolicyClassType,
    action: string,
    ...params: unknown[]
  ): Promise<boolean>;
  public async allows (
    user: unknown,
    actionOrPolicyClass: string | PolicyClassType,
    ...params: unknown[]
  ): Promise<boolean> {
    if (typeof actionOrPolicyClass === 'string') {
      const actionCallback = this.actions.get(actionOrPolicyClass)
      if (actionCallback) {
        return Boolean(await actionCallback(user, ...params))
      }
      throw new Error(
        `Found no action callback for action ${actionOrPolicyClass}`,
      )
    } else {
      let policyInstance = this.policies.get(actionOrPolicyClass)
      if (!policyInstance) {
        policyInstance = new actionOrPolicyClass()
        this.policies.set(actionOrPolicyClass, policyInstance)
      }
      const [action, ...restParams] = params
      if (typeof action !== 'string') {
        throw new Error('Policy method name must be a string')
      }
      if (policyInstance[action]) {
        return Boolean(await policyInstance[action](user, ...restParams))
      }
      throw new Error(`Found no Policy method named ${action}`)
    }
  }

  public async denies (
    user: unknown,
    action: string,
    ...params: unknown[]
  ): Promise<boolean> {
    const allows = await this.allows(user, action, ...params)
    return !allows
  }
}

class UserGate {
  private gate: Gate
  private user: unknown

  constructor (user: unknown, gate: Gate) {
    this.gate = gate
    this.user = user
  }

  public allows (action: string, ...params: unknown[]): Promise<boolean> {
    return this.gate.allows(this.user, action, ...params)
  }

  public denies (action: string, ...params: unknown[]): Promise<boolean> {
    return this.gate.denies(this.user, action, ...params)
  }

  public async authorize (action: string, ...params: unknown[]): Promise<void> {
    const isAllowed = await this.allows(action, ...params)
    if (!isAllowed) {
      throw new Error(`Unauthorized to "${action}"`)
    }
  }
}

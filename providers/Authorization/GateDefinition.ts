export class GateDefinition {
  public isGuestAllowed: boolean

  constructor (options: GateOptions = {}) {
    const { allowGuest = false } = options
    this.isGuestAllowed = allowGuest
  }
}

export interface GateOptions {
  allowGuest?: boolean;
}

import {GateDefinition, GateOptions} from './GateDefinition'

export default function gateDecorator (options?: GateOptions) {
  const definition = new GateDefinition(options)
  return function decorateGate (target, name, descriptor) {
    if (typeof descriptor.value !== 'function') {
      throw new Error('The gate decorator must be applied to a function')
    }
    bootPolicy(target)
    target.$gates.set(name, definition)
  }
}

function bootPolicy (policy) {
  if (!policy.$gates) {
    policy.$gates = new Map()
  }
}

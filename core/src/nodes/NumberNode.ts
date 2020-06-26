import { INode, Base } from './Node'

type NumberNodeConfig = {
  /** Whether only integers are allowed */
  integer?: boolean
  /** If specified, number will be capped at this minimum */
  min?: number
  /** If specified, number will be capped at this maximum */
  max?: number
}

export const NumberNode = (config?: NumberNodeConfig): INode<number> => {
  const integer = config?.integer ?? false
  const min = config?.min ?? -Infinity
  const max = config?.max ?? Infinity
  const between = config?.min !== undefined && config?.max !== undefined

  return {
    ...Base,
    default: () => 0,
    render(path, value, view, options) {
      const onChange = view.registerChange(el => {
        const value = (el as HTMLInputElement).value
        let parsed = integer ? parseInt(value) : parseFloat(value)
        view.model.set(path, parsed)
      })
      return `<div class="node number-node node-header" ${path.error()}>
        ${options?.prepend ?? ''}
        <label>${options?.label ?? path.locale()}</label>
        ${options?.inject ?? ''}
        <input data-id="${onChange}" value="${value ?? ''}">
      </div>`
    },
    validate(path, value, errors) {
      if (typeof value !== 'number') {
        errors.add(path, 'error.expected_number')
      } else if (integer && !Number.isInteger(value)) {
        errors.add(path, 'error.expected_integer')
      } else if (between && (value < min || value > max)) {
        errors.add(path, 'error.expected_number_between', min, max)
      } else if (value < min) {
        errors.add(path, 'error.invalid_range.smaller', value, min)
      } else if (value > max) {
        errors.add(path, 'error.invalid_range.larger', value, max)
      }
      return value
    }
  }
}
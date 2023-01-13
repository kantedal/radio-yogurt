import clsx from 'clsx'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'

export type SelectOption<T = string> = { value: T; label: string }

export interface InputProps extends InputHTMLAttributes<HTMLSelectElement> {
  label?: string | null
  options: SelectOption[]
  icon?: ReactNode
  helpText?: string | null
  error?: string | null
  classes?: { root?: string; input?: string; label?: string; error?: string }
}

const Select = forwardRef<HTMLSelectElement, InputProps>(
  ({ label, options, error, icon, classes = { root: '', input: '', label: '', error: '' }, ...rest }, ref) => {
    return (
      <div className={classes.root}>
        {label && (
          <label htmlFor={rest.name} className={clsx('block text-sm font-medium text-gray-700', classes.label)}>
            {label}
          </label>
        )}
        <div className={clsx('relative', label && 'mt-1')}>
          {icon && <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-xl text-gray-500'>{icon}</div>}
          <select
            ref={ref}
            {...rest}
            className={clsx(
              'block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 pr-8',
              'shadow-sm focus:outline-none focus:ring-radio-yogurt-primary focus:border-radio-yogurt-primary sm:text-sm',
              icon && 'pl-10',
              classes.input,
              rest.className,
            )}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {Boolean(error) && <p className={clsx('mt-2 text-sm text-red-600', classes.error)}>{error}</p>}
      </div>
    )
  },
)

Select.displayName = 'Select'

export default Select

import React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../utils/cn'
import { Field, controlClass, useFieldId, describedBy } from './Field'

const Select = React.forwardRef(({
  className,
  label,
  hint,
  error,
  id,
  children,
  ...props
}, ref) => {
  const fieldId = useFieldId(id)
  return (
    <Field id={fieldId} label={label} hint={hint} error={error} required={props.required}>
      <div className="relative">
        <select
          id={fieldId}
          className={cn(controlClass(error), 'h-11 appearance-none pr-10', className)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(fieldId, hint, error)}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-[var(--ink-3)]" aria-hidden="true" />
      </div>
    </Field>
  )
})

Select.displayName = 'Select'

export default Select

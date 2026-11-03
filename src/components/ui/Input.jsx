import React from 'react'
import { cn } from '../../utils/cn'
import { Field, controlClass, useFieldId, describedBy } from './Field'

const Input = React.forwardRef(({
  className,
  type = 'text',
  label,
  hint,
  error,
  id,
  ...props
}, ref) => {
  const fieldId = useFieldId(id)
  return (
    <Field id={fieldId} label={label} hint={hint} error={error} required={props.required}>
      <input
        id={fieldId}
        type={type}
        className={cn(controlClass(error), 'h-11', className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(fieldId, hint, error)}
        ref={ref}
        {...props}
      />
    </Field>
  )
})

Input.displayName = 'Input'

export default Input

import React from 'react'
import { cn } from '../../utils/cn'
import { Field, controlClass, useFieldId, describedBy } from './Field'

const Textarea = React.forwardRef(({
  className,
  label,
  hint,
  error,
  id,
  ...props
}, ref) => {
  const fieldId = useFieldId(id)
  return (
    <Field id={fieldId} label={label} hint={hint} error={error} required={props.required}>
      <textarea
        id={fieldId}
        className={cn(controlClass(error), 'py-2.5 min-h-[112px] resize-y leading-relaxed', className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(fieldId, hint, error)}
        ref={ref}
        {...props}
      />
    </Field>
  )
})

Textarea.displayName = 'Textarea'

export default Textarea

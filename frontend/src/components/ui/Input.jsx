import { forwardRef, useState, useId } from 'react'
import { Eye, EyeOff } from 'lucide-react'

const Input = forwardRef(function Input(
  {
    label,
    error,
    type = 'text',
    placeholder,
    className = '',
    admin = false,
    required = false,
    hint,
    id: externalId,
    ...props
  },
  ref
) {
  const generatedId = useId()
  const id = externalId || generatedId
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-[var(--text-secondary)] font-body">
          {label}
          {required && <span className="text-[var(--danger)] ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          ref={ref}
          className={`
            input-field
            ${admin ? 'input-field-admin' : ''}
            ${error ? 'input-error' : ''}
            ${isPassword ? 'pr-12' : ''}
          `}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors p-1"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-[var(--text-muted)] font-body">{hint}</p>
      )}

      {error && (
        <p
          id={`${id}-error`}
          className="text-xs text-[var(--danger)] font-body flex items-center gap-1"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input

export const Textarea = forwardRef(function Textarea(
  {
    label,
    error,
    className = '',
    admin = false,
    required = false,
    id: externalId,
    ...props
  },
  ref
) {
  const generatedId = useId()
  const id = externalId || generatedId

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-[var(--text-secondary)] font-body">
          {label}
          {required && <span className="text-[var(--danger)] ml-1">*</span>}
        </label>
      )}
      <textarea
        id={id}
        ref={ref}
        className={`
          input-field resize-none
          ${admin ? 'input-field-admin' : ''}
          ${error ? 'input-error' : ''}
        `}
        rows={4}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="text-xs text-[var(--danger)] font-body" role="alert">
          {error}
        </p>
      )}
    </div>
  )
})

Textarea.displayName = 'Textarea'

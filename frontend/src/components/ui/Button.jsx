import { motion } from 'framer-motion'
import Spinner from './Spinner'

const variants = {
  primary: 'btn-primary',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
  admin: 'btn-admin',
}

const sizes = {
  sm: 'text-sm px-4 py-2 min-h-[36px]',
  md: 'text-base px-7 py-3',
  lg: 'text-lg px-8 py-4',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  fullWidth = false,
  ...props
}) {
  const baseClass = variants[variant] || variants.primary
  const sizeClass = sizes[size] || sizes.md

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      className={`
        ${baseClass} ${sizeClass}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <Spinner size="sm" />
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </motion.button>
  )
}

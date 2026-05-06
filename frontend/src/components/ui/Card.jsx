import { motion } from 'framer-motion'

const cardVariants = {
  initial: { opacity: 0, scale: 0.94, y: 20 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 20 },
  },
}

export default function Card({
  children,
  className = '',
  hover = true,
  glow = false,
  admin = false,
  onClick,
  animate = true,
  padding = true,
}) {
  const glowClass = glow
    ? admin
      ? 'shadow-[0_0_30px_var(--admin-glow)]'
      : 'shadow-[0_0_30px_var(--accent-glow)]'
    : ''

  const hoverClass = hover ? (admin ? 'glass-card glass-card-admin cursor-pointer' : 'glass-card cursor-pointer') : 'glass-card'

  const Component = animate ? motion.div : 'div'
  const animProps = animate ? { variants: cardVariants, initial: 'initial', animate: 'animate' } : {}

  return (
    <Component
      className={`
        ${hoverClass}
        ${padding ? 'p-6' : ''}
        ${glowClass}
        ${className}
      `}
      onClick={onClick}
      {...animProps}
    >
      {children}
    </Component>
  )
}
